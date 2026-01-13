"use client";
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  difficulty: string;
  time: string;
}

const Header: React.FC<HeaderProps> = ({ difficulty, time }) => {
  return (
    <header className="w-full max-w-lg mb-4 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-primary">SudokuZen</h1>
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="text-sm">{difficulty}</Badge>
        <span className="text-lg font-semibold tabular-nums">{time}</span>
      </div>
    </header>
  );
};

export default Header;
