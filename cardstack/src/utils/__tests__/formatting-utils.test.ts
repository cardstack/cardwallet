import { normalizeTxHash } from '@cardstack/utils/formatting-utils';

describe('formatting utils', () => {
  describe('normalizeHash', () => {
    const txHash = [
      '0x45db6437ea2d515a06485bb0d33fbfd8986343c6fbadf7799d63eeea0a445c19-000',
      '0x45db6437ea2d515a06485bb0d33fbfd8986343c6fbadf7799d63eeea0a445c19-0',
      '0x45db6437ea2d515a06485bb0d33fbfd8986343c6fbadf7799d63eeea0a445c19-',
      '0x45db6437ea2d515a06485bb0d33fbfd8986343c6fbadf7799d63eeea0a445c19---',
    ];

    test.each(txHash)(
      'should return normalized hash without dash appended string',
      hash => {
        expect(normalizeTxHash(hash)).toEqual(
          '0x45db6437ea2d515a06485bb0d33fbfd8986343c6fbadf7799d63eeea0a445c19'
        );
      }
    );
  });
});
