import type { Difficulty, SudokuGrid, Cell } from './types';

const SIZE = 9;
const BOX_SIZE = 3;

const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const isSafe = (board: number[][], row: number, col: number, num: number): boolean => {
  for (let x = 0; x < SIZE; x++) {
    if (board[row][x] === num || board[x][col] === num) {
      return false;
    }
  }

  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (board[i + startRow][j + startCol] === num) {
        return false;
      }
    }
  }

  return true;
};

const fillBoard = (board: number[][]): boolean => {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === 0) {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of numbers) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const generateFullBoard = (): number[][] => {
  const board: number[][] = Array(SIZE).fill(0).map(() => Array(SIZE).fill(0));
  fillBoard(board);
  return board;
};

const removeNumbers = (board: number[][], difficulty: Difficulty) => {
  let attempts;
  switch (difficulty) {
    case 'Easy':
      attempts = 40;
      break;
    case 'Medium':
      attempts = 50;
      break;
    case 'Hard':
      attempts = 60;
      break;
    default:
      attempts = 45;
  }

  while (attempts > 0) {
    const row = Math.floor(Math.random() * SIZE);
    const col = Math.floor(Math.random() * SIZE);

    if (board[row][col] !== 0) {
      board[row][col] = 0;
      attempts--;
    }
  }
};

export const generatePuzzle = (difficulty: Difficulty): { puzzleGrid: SudokuGrid; solvedGrid: number[][] } => {
  const solvedBoard = generateFullBoard();
  const puzzleBoard = solvedBoard.map(row => [...row]);
  removeNumbers(puzzleBoard, difficulty);
  
  const puzzleGrid: SudokuGrid = puzzleBoard.map(row =>
    row.map(value => ({
      value: value === 0 ? null : value,
      isOriginal: value !== 0,
      notes: new Set(),
      isError: false,
    }))
  );

  return { puzzleGrid, solvedGrid: solvedBoard };
};

export const checkWin = (currentGrid: SudokuGrid, solvedGrid: number[][]): boolean => {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (currentGrid[row][col].value !== solvedGrid[row][col]) {
        return false;
      }
    }
  }
  return true;
};

export const deepCloneGrid = (grid: SudokuGrid): SudokuGrid => {
  return grid.map(row =>
    row.map(cell => ({
      ...cell,
      notes: new Set(cell.notes),
    }))
  );
};

export const updateErrors = (grid: SudokuGrid): SudokuGrid => {
    const newGrid = deepCloneGrid(grid);
    
    // Reset all errors first
    for(let r=0; r<SIZE; r++) {
        for(let c=0; c<SIZE; c++) {
            newGrid[r][c].isError = false;
        }
    }

    // Check for errors
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            const cell = newGrid[row][col];
            if (cell.value === null || cell.isOriginal) continue;

            let hasError = false;
            // Check row
            for(let c=0; c<SIZE; c++) {
                if(c !== col && newGrid[row][c].value === cell.value) {
                    hasError = true;
                    break;
                }
            }
            if(hasError) {
                cell.isError = true;
                continue;
            }

            // Check column
            for(let r=0; r<SIZE; r++) {
                if(r !== row && newGrid[r][col].value === cell.value) {
                    hasError = true;
                    break;
                }
            }
            if(hasError) {
                cell.isError = true;
                continue;
            }

            // Check 3x3 box
            const startRow = row - row % 3;
            const startCol = col - col % 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if ((startRow + i !== row || startCol + j !== col) && newGrid[startRow + i][startCol + j].value === cell.value) {
                        hasError = true;
                        break;
                    }
                }
                if(hasError) break;
            }
            if(hasError) {
                cell.isError = true;
            }
        }
    }
    return newGrid;
}
