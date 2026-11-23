import React from 'react';
import { FindYourStrength } from './find-your-strength/FindYourStrength';

interface ProgramsSectionProps {
  onSelectProgram: (programTitle: string) => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ onSelectProgram }) => {
  return <FindYourStrength onBookTrial={onSelectProgram} />;
};