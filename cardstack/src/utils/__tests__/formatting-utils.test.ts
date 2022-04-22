import {
  normalizeTxHash,
  fromWeiToFixedEth,
  transformObjKeysToCamelCase,
} from '@cardstack/utils/formatting-utils';

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

  describe('fromWeiToFixedEth', () => {
    const amounts = [
      { wei: '58702316848670658683', formatted: '58.70' },
      { wei: '382409177820267686424', formatted: '382.41' },
      { wei: '3818914000000000', formatted: '0.00' },
      { wei: '184162869133241516766', formatted: '184.16' },
    ];

    test.each(amounts)(
      'should return amount in eth with 2 decimals',
      ({ wei, formatted }) => {
        expect(fromWeiToFixedEth(wei)).toEqual(formatted);
      }
    );
  });

  describe('transformObjKeysToCamelCase', () => {
    it('should return object with camelCase keys', () => {
      const kebabObj = {
        'first-attr': 'foo',
        'second-attr': 'bar',
      };

      const camelCaseObjResult = {
        firstAttr: 'foo',
        secondAttr: 'bar',
      };

      const result = transformObjKeysToCamelCase(kebabObj);

      expect(result).toStrictEqual(camelCaseObjResult);
    });

    it('should return same object if there is no case difference', () => {
      const obj = {
        first: 'foo',
        second: 'bar',
      };

      const result = transformObjKeysToCamelCase(obj);

      expect(result).toStrictEqual(obj);
    });
  });
});
