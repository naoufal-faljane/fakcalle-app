export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Cell {
  value: number | null;
  isOriginal: boolean;
  notes: Set<number>;
  isError: boolean;
}

export type SudokuGrid = Cell[][];
