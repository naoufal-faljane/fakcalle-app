"use client";
import React from "react";
import { cn } from "@/lib/utils";
import type { SudokuGrid, Cell } from "@/lib/types";

interface SudokuGridProps {
  grid: SudokuGrid;
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
}

const SudokuGridComponent: React.FC<SudokuGridProps> = ({ grid, selectedCell, onCellClick }) => {
  return (
    <div className="grid grid-cols-9 bg-border gap-px w-full max-w-[500px] aspect-square shadow-lg rounded-lg overflow-hidden border">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
          const isRelated = selectedCell ? (
            rowIndex === selectedCell.row ||
            colIndex === selectedCell.col ||
            (Math.floor(rowIndex / 3) === Math.floor(selectedCell.row / 3) && Math.floor(colIndex / 3) === Math.floor(selectedCell.col / 3))
          ) : false;

          const hasSameValue = selectedCell && grid[selectedCell.row][selectedCell.col].value !== null && cell.value === grid[selectedCell.row][selectedCell.col].value;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
              className={cn(
                "flex items-center justify-center aspect-square cursor-pointer transition-colors duration-150 bg-card",
                (rowIndex + 1) % 3 === 0 && rowIndex < 8 && "border-b-2 border-b-primary/50",
                (colIndex + 1) % 3 === 0 && colIndex < 8 && "border-r-2 border-r-primary/50",
                isRelated && "bg-accent/50",
                isSelected && "bg-primary/30 ring-2 ring-primary z-10",
                cell.isError && !cell.isOriginal && "text-destructive animate-shake",
                hasSameValue && "bg-primary/20"
              )}
            >
              {cell.value !== null ? (
                <span className={cn(
                    "text-2xl sm:text-3xl md:text-4xl",
                    cell.isOriginal ? "text-foreground font-semibold" : "text-primary-foreground font-medium"
                )}>
                  {cell.value}
                </span>
              ) : (
                <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-px">
                  {Array.from({ length: 9 }).map((_, i) => {
                    const noteValue = i + 1;
                    return (
                      <span key={i} className="flex items-center justify-center text-[10px] sm:text-xs text-muted-foreground">
                        {cell.notes.has(noteValue) ? noteValue : ''}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default SudokuGridComponent;
