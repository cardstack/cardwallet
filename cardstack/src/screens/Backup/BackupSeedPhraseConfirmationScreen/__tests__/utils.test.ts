import { splitSeedPhrase, shuffleSeedPhraseAsArray } from '../utils';

const mockSeedPhrase = 'first second third fourth';

describe('Shuffle seed phrase functions', () => {
  it('should split phrase into array with correct words and order', () => {
    const splittedPhrase = splitSeedPhrase(mockSeedPhrase);

    expect(splittedPhrase).toEqual(['first', 'second', 'third', 'fourth']);
  });

  it('should scramble the words in the seed phrase', () => {
    const shuffledPhrase = shuffleSeedPhraseAsArray(mockSeedPhrase);

    expect(shuffledPhrase.length).toEqual(4);

    expect(shuffledPhrase.join(' ')).not.toEqual(mockSeedPhrase);
  });
});
