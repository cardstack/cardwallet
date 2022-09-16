// SeedPhraseTable utils.

export const filledArrayFromSeedPhraseString = (
  seedPhrase: string
): Array<string> => {
  const words = seedPhrase?.split(' ') || [];
  const filler = new Array(12 - words.length).fill('');

  return [...words, ...filler];
};

export const splitSeedPhraseArrayInTwoColunms = (
  seedPhraseFilledArray: Array<string>
) => [seedPhraseFilledArray.slice(0, 6), seedPhraseFilledArray.slice(6)];
