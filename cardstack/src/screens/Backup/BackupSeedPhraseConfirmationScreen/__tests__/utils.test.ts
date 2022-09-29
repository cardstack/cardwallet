import { seedPhraseStringToArray, shuffleSeedPhraseAsArray } from '../utils';

const mockSeedPhrase = 'first second third fourth fifth sixth seventh eighth';

describe('Shuffle seed phrase functions', () => {
  it('should split phrase into array with correct words and order', () => {
    const splittedPhrase = seedPhraseStringToArray(mockSeedPhrase);

    expect(splittedPhrase).toEqual([
      'first',
      'second',
      'third',
      'fourth',
      'fifth',
      'sixth',
      'seventh',
      'eighth',
    ]);
  });

  it('should scramble the words in the seed phrase', () => {
    const shuffledPhrase = shuffleSeedPhraseAsArray(mockSeedPhrase);

    expect(shuffledPhrase.length).toEqual(8);

    expect(shuffledPhrase.join(' ')).not.toEqual(mockSeedPhrase);
  });
});
