"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo2, Eraser, Pencil, PlusCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ControlsProps {
  onNumberInput: (num: number) => void;
  onErase: () => void;
  onNotesToggle: () => void;
  onUndo: () => void;
  isNotesMode: boolean;
  onNewGameClick: () => void;
  onResetClick: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  onNumberInput,
  onErase,
  onNotesToggle,
  onUndo,
  isNotesMode,
  onNewGameClick,
  onResetClick,
}) => {
  const controlButtons = [
    { icon: PlusCircle, label: 'New Game', onClick: onNewGameClick },
    { icon: RotateCcw, label: 'Reset', onClick: onResetClick },
    { icon: Undo2, label: 'Undo', onClick: onUndo },
    { icon: Eraser, label: 'Erase', onClick: onErase },
    { icon: Pencil, label: 'Notes', onClick: onNotesToggle, active: isNotesMode },
  ];

  return (
    <footer className="w-full max-w-lg mt-4 flex flex-col gap-2 sm:gap-3">
      <div className="grid grid-cols-5 gap-2">
        {controlButtons.map(({ icon: Icon, label, onClick, active }) => (
          <Button
            key={label}
            variant={active ? 'default' : 'secondary'}
            className="flex flex-col h-14 sm:h-16 items-center justify-center gap-1 text-xs"
            onClick={onClick}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>{label}</span>
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-9 gap-1 sm:gap-2">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
          <Button
            key={num}
            variant="secondary"
            className="text-2xl sm:text-3xl font-bold h-12 sm:h-14"
            onClick={() => onNumberInput(num)}
          >
            {num}
          </Button>
        ))}
      </div>
    </footer>
  );
};

export default Controls;
