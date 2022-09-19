const splitSeedPhrase = (seedPhrase: string) => seedPhrase.split(' ');

/** Array shuffle, extract from 'https://stackoverflow.com/a/46545530/469870'
 * 1. Each element in the array is put in an object, and is given a random sort key
 * 2. Sort is applied using the random key
 * 3. Unmap elements to get the original objects
 * speed: O(N log N), same as quick sort
 */
const shuffleWords = (words: Array<string>) =>
  words
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export const shuffleSeedPhraseAsArray = (seedPhrase: string) =>
  shuffleWords(splitSeedPhrase(seedPhrase));
