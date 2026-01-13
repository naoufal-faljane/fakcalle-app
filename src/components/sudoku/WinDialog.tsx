"use client";
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PartyPopper } from 'lucide-react';

interface WinDialogProps {
  isOpen: boolean;
  onNewGame: () => void;
  time: string;
}

const WinDialog: React.FC<WinDialogProps> = ({ isOpen, onNewGame, time }) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
            <PartyPopper className="h-16 w-16 text-primary" />
          <DialogTitle className="text-2xl">Congratulations!</DialogTitle>
          <DialogDescription>
            You solved the puzzle in {time}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-center">
          <Button onClick={onNewGame}>Play Again</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WinDialog;
