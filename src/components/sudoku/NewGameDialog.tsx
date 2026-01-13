"use client";
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { Difficulty } from '@/lib/types';

interface NewGameDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onNewGame: (difficulty: Difficulty) => void;
  currentDifficulty: Difficulty;
}

const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

const NewGameDialog: React.FC<NewGameDialogProps> = ({
  isOpen,
  onOpenChange,
  onNewGame,
  currentDifficulty,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(currentDifficulty);

  const handleStart = () => {
    onNewGame(selectedDifficulty);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Game</DialogTitle>
          <DialogDescription>Select a difficulty to start a new puzzle.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            defaultValue={selectedDifficulty}
            onValueChange={(value: Difficulty) => setSelectedDifficulty(value)}
            className="grid grid-cols-3 gap-4"
          >
            {difficulties.map((difficulty) => (
              <div key={difficulty}>
                <RadioGroupItem value={difficulty} id={difficulty} className="peer sr-only" />
                <Label
                  htmlFor={difficulty}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  {difficulty}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleStart}>Start New Game</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewGameDialog;
