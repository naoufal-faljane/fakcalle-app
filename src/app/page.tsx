"use client";
import React, { useEffect, useReducer, useCallback, useState } from "react";
import { generatePuzzle, checkWin, deepCloneGrid, updateErrors } from "@/lib/sudoku";
import type { SudokuGrid, Difficulty } from "@/lib/types";
import { useTimer } from "@/hooks/use-timer";
import SudokuGridComponent from "@/components/sudoku/SudokuGrid";
import Controls from "@/components/sudoku/Controls";
import Header from "@/components/sudoku/Header";
import NewGameDialog from "@/components/sudoku/NewGameDialog";
import WinDialog from "@/components/sudoku/WinDialog";
import { Skeleton } from "@/components/ui/skeleton";

const MAX_HISTORY = 10;

interface GameState {
  difficulty: Difficulty;
  initialGrid: SudokuGrid | null;
  solvedGrid: number[][] | null;
  currentGrid: SudokuGrid | null;
  selectedCell: { row: number; col: number } | null;
  history: SudokuGrid[];
  isNotesMode: boolean;
  isGameRunning: boolean;
  isGameWon: boolean;
  isNewGameDialogOpen: boolean;
}

type Action =
  | { type: "NEW_GAME"; payload: { difficulty: Difficulty } }
  | { type: "SET_INITIAL_STATE"; payload: { puzzleGrid: SudokuGrid, solvedGrid: number[][], difficulty: Difficulty } }
  | { type: "SELECT_CELL"; payload: { row: number; col: number } | null }
  | { type: "ENTER_NUMBER"; payload: { number: number } }
  | { type: "ERASE_CELL" }
  | { type: "TOGGLE_NOTES_MODE" }
  | { type: "UNDO" }
  | { type: "RESET_GAME" }
  | { type: "OPEN_NEW_GAME_DIALOG"; payload: boolean };

const initialState: GameState = {
  difficulty: 'Easy',
  initialGrid: null,
  solvedGrid: null,
  currentGrid: null,
  selectedCell: null,
  history: [],
  isNotesMode: false,
  isGameRunning: false,
  isGameWon: false,
  isNewGameDialogOpen: false,
};

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SET_INITIAL_STATE": {
        return {
            ...initialState,
            difficulty: action.payload.difficulty,
            initialGrid: action.payload.puzzleGrid,
            solvedGrid: action.payload.solvedGrid,
            currentGrid: deepCloneGrid(action.payload.puzzleGrid),
            isGameRunning: true,
        }
    }
    case "NEW_GAME": {
      const { puzzleGrid, solvedGrid } = generatePuzzle(action.payload.difficulty);
      return {
        ...initialState,
        difficulty: action.payload.difficulty,
        initialGrid: puzzleGrid,
        solvedGrid: solvedGrid,
        currentGrid: deepCloneGrid(puzzleGrid),
        isNewGameDialogOpen: false,
        isGameRunning: true,
      };
    }
    case "SELECT_CELL": {
      return { ...state, selectedCell: action.payload };
    }
    case "ENTER_NUMBER": {
      if (!state.selectedCell || !state.currentGrid || !state.initialGrid || !state.solvedGrid) return state;
      const { row, col } = state.selectedCell;
      const originalCell = state.initialGrid[row][col];
      if (originalCell.isOriginal) return state;

      const newGrid = deepCloneGrid(state.currentGrid);
      const cell = newGrid[row][col];
      const newHistory = [state.currentGrid, ...state.history].slice(0, MAX_HISTORY);

      if (state.isNotesMode) {
        if (cell.notes.has(action.payload.number)) {
          cell.notes.delete(action.payload.number);
        } else {
          cell.notes.add(action.payload.number);
        }
        cell.value = null;
      } else {
        cell.value = action.payload.number;
        cell.notes.clear();
      }
      
      const gridWithErrors = updateErrors(newGrid);
      const isWon = !state.isNotesMode && checkWin(gridWithErrors, state.solvedGrid);

      return {
        ...state,
        currentGrid: gridWithErrors,
        history: newHistory,
        isGameWon: isWon,
        isGameRunning: !isWon,
      };
    }
    case "ERASE_CELL": {
      if (!state.selectedCell || !state.currentGrid || !state.initialGrid) return state;
      const { row, col } = state.selectedCell;
      if (state.initialGrid[row][col].isOriginal) return state;
      
      const newGrid = deepCloneGrid(state.currentGrid);
      newGrid[row][col].value = null;
      newGrid[row][col].notes.clear();
      const gridWithErrors = updateErrors(newGrid);
       const newHistory = [state.currentGrid, ...state.history].slice(0, MAX_HISTORY);

      return { ...state, currentGrid: gridWithErrors, history: newHistory };
    }
    case "TOGGLE_NOTES_MODE": {
      return { ...state, isNotesMode: !state.isNotesMode };
    }
    case "UNDO": {
      if (state.history.length === 0) return state;
      const lastGrid = state.history[0];
      const newHistory = state.history.slice(1);
      return { ...state, currentGrid: deepCloneGrid(lastGrid), history: newHistory };
    }
    case "RESET_GAME": {
      if (!state.initialGrid) return state;
      return {
        ...state,
        currentGrid: deepCloneGrid(state.initialGrid),
        history: [],
        isNotesMode: false,
        selectedCell: null,
      };
    }
    case "OPEN_NEW_GAME_DIALOG": {
      return { ...state, isNewGameDialogOpen: action.payload };
    }
    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { time, formattedTime, resetTimer } = useTimer(state.isGameRunning);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const initialDifficulty: Difficulty = 'Easy';
    const { puzzleGrid, solvedGrid } = generatePuzzle(initialDifficulty);
    dispatch({ type: 'SET_INITIAL_STATE', payload: { puzzleGrid, solvedGrid, difficulty: initialDifficulty } });
  }, []);

  const handleNewGame = useCallback((difficulty: Difficulty) => {
    dispatch({ type: "NEW_GAME", payload: { difficulty } });
    resetTimer();
  }, [resetTimer]);
  
  const handleCellClick = useCallback((row: number, col: number) => {
    dispatch({ type: "SELECT_CELL", payload: { row, col } });
  }, []);

  const handleNumberInput = useCallback((number: number) => {
    dispatch({ type: "ENTER_NUMBER", payload: { number } });
  }, []);

  const handleErase = useCallback(() => {
    dispatch({ type: "ERASE_CELL" });
  }, []);

  const handleNotesToggle = useCallback(() => {
    dispatch({ type: "TOGGLE_NOTES_MODE" });
  }, []);

  const handleUndo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
    resetTimer();
  }, [resetTimer]);

  const openNewGameDialog = useCallback(() => {
    dispatch({ type: "OPEN_NEW_GAME_DIALOG", payload: true });
  }, []);

  if (!isClient || !state.currentGrid) {
    return (
      <div className="flex flex-col items-center justify-between min-h-screen p-2 sm:p-4 bg-background text-foreground font-body">
        <Header difficulty="Easy" time="00:00" />
        <main className="flex flex-col items-center justify-center w-full">
           <Skeleton className="w-full max-w-[500px] aspect-square" />
        </main>
        <footer className="w-full max-w-lg mt-4 flex flex-col gap-2 sm:gap-3">
            <div className="grid grid-cols-5 gap-2">
                {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-14 sm:h-16" />)}
            </div>
            <div className="grid grid-cols-9 gap-1 sm:gap-2">
                {Array.from({length: 9}).map((_, i) => <Skeleton key={i} className="h-12 sm:h-14" />)}
            </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-2 sm:p-4 bg-background text-foreground font-body">
      <Header difficulty={state.difficulty} time={formattedTime} />

      <main className="flex flex-col items-center justify-center w-full">
        <SudokuGridComponent
          grid={state.currentGrid}
          selectedCell={state.selectedCell}
          onCellClick={handleCellClick}
        />
      </main>

      <Controls
        onNumberInput={handleNumberInput}
        onErase={handleErase}
        onNotesToggle={handleNotesToggle}
        onUndo={handleUndo}
        isNotesMode={state.isNotesMode}
        onNewGameClick={openNewGameDialog}
        onResetClick={handleReset}
      />
      
      <NewGameDialog
        isOpen={state.isNewGameDialogOpen}
        onOpenChange={(isOpen) => dispatch({ type: 'OPEN_NEW_GAME_DIALOG', payload: isOpen })}
        onNewGame={handleNewGame}
        currentDifficulty={state.difficulty}
      />

      <WinDialog
        isOpen={state.isGameWon}
        onNewGame={openNewGameDialog}
        time={formattedTime}
      />
    </div>
  );
}
