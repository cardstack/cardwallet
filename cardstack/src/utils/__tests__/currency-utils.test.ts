import { formatNative } from '../currency-utils';

jest.mock('../device');

describe('Currency utils', () => {
  describe('formatNative', () => {
    it('should return empty string if undefined value is provided', () => {
      const formattedValue = formatNative(undefined);

      expect(formattedValue).toBe('');
    });

    it("should not get rid of .(dot) even if it's not number", () => {
      const formattedValue = formatNative('12345.');

      expect(formattedValue).toBe('12,345.00');
    });

    it('should return formatted number', () => {
      const formattedValue = formatNative('12345.6');

      expect(formattedValue).toBe('12,345.60');
    });

    it("should not get rid of 0 at the end if it's after decimal dot", () => {
      const formattedValue = formatNative('12345.67890');

      expect(formattedValue).toBe('12,345.68');
    });

    it('SPD should have no decimals', () => {
      const formattedValue = formatNative('12345.67890', 'SPD');

      expect(formattedValue).toBe('12,345');
    });
  });
});
