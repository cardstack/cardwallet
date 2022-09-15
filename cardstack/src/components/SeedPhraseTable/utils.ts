// SeedPhraseTable utils.

export const filledArrayFromSeedPhraseString = (
  seedPhrase: string
): Array<{
  word: string;
  index: number;
}> => {
  const words = seedPhrase?.split(' ') || [];
  const filler = new Array(12 - words.length).fill('');

  return [...words, ...filler].map((word, index) => ({
    word,
    index,
  }));
};

export const splitSeedPhraseArrayInTwoColunms = (
  seedPhraseFilledArray: Array<{
    word: string;
    index: number;
  }>
) => [seedPhraseFilledArray.slice(0, 6), seedPhraseFilledArray.slice(6)];
