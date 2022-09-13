import React from 'react';

interface SeedPhraseTableProps {
  seedPhrase: string;
}

export const SeedPhraseTable = ({ seedPhrase }: SeedPhraseTableProps) => {
  return <>{seedPhrase}</>;
};
