import { splitSeedPhrase, shuffleSeedPhraseAsArray } from '../utils';

const mockSeedPhrase = 'first second third fourth';

describe('Shuffle seed phrase funtions', () => {
  it('should split phrase into array with correct words and order', () => {
    const splittedPhrase = splitSeedPhrase(mockSeedPhrase);

    expect(splittedPhrase).toEqual(['first', 'second', 'third', 'fourth']);
  });

  it('should contain the same amount of words but not be the same as original phrase', () => {
    const shuffledPhrase = shuffleSeedPhraseAsArray(mockSeedPhrase);

    expect(shuffledPhrase.length).toEqual(mockSeedPhrase.split(' ').length);
    expect(shuffledPhrase.join(' ')).not.toEqual(mockSeedPhrase);
  });
});
