import { formatNative, nativeCurrencyToSpend } from '../currency-utils';

jest.mock('../device');

describe('Currency utils', () => {
  describe('formatNative', () => {
    it('should return empty string if undefined value is provided', () => {
      const formattedValue = formatNative(undefined);

      expect(formattedValue).toBe('');
    });

    it('should return only number if non-number is provided', () => {
      const formattedValue = formatNative('123A');

      expect(formattedValue).toBe('123');
    });

    it("should not get rid of .(dot) even if it's not number", () => {
      const formattedValue = formatNative('12345.');

      expect(formattedValue).toBe('12,345.');
    });

    it('should return formatted number', () => {
      const formattedValue = formatNative('12345.6789');

      expect(formattedValue).toBe('12,345.6789');
    });

    it("should not get rid of 0 at the end if it's after decimal dot", () => {
      const formattedValue = formatNative('12345.67890');

      expect(formattedValue).toBe('12,345.67890');
    });

    it('should work for difference currencies', () => {
      const formattedValue = formatNative('12345.67890', 'SPD');

      expect(formattedValue).toBe('12,345.67890');
    });
  });

  describe('nativeCurrencyToSpend', () => {
    it('should return spend for provided usd', () => {
      const formattedValue = nativeCurrencyToSpend('1', 1);

      expect(formattedValue).toStrictEqual({
        display: '§100',
        amount: 100,
      });
    });

    it('should return spend with suffix for suffix is enabled', () => {
      const formattedValue = nativeCurrencyToSpend('1', 1, true);

      expect(formattedValue).toStrictEqual({
        display: '§100 SPEND',
        amount: 100,
      });
    });

    it('should round and return spend amount', () => {
      const formattedValue = nativeCurrencyToSpend('0.2345', 1, true);

      expect(formattedValue).toStrictEqual({
        display: '§24 SPEND',
        amount: 24,
      });
    });

    it('should round and return spend amount for different currency rate', () => {
      const formattedValue = nativeCurrencyToSpend('0.2345', 1.2, true);

      expect(formattedValue).toStrictEqual({
        display: '§20 SPEND',
        amount: 20,
      });
    });

    it('should return formatted valid spend amount for native formatted input value', () => {
      const formattedValue = nativeCurrencyToSpend('1,234.1234', 1.2, true);

      expect(formattedValue).toStrictEqual({
        display: '§102,844 SPEND',
        amount: 102844,
      });
    });
  });
});
