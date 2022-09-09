import { emails } from '../__mocks__/emails';
import {
  isEmailPartial,
  isEmailValid,
  hasAtLeastOneDigit,
} from '../validators';

const { valids, invalids, partialValids } = emails;

describe('Email validator', () => {
  it('should return true for valid emails', () => {
    valids.forEach(email => {
      const result = isEmailValid(email);
      expect({ email, result }).toEqual({ email, result: true });
    });
  });

  it('should return false for invalid emails', () => {
    invalids.forEach(email => {
      const result = isEmailValid(email);
      expect({ email, result }).toEqual({ email, result: false });
    });
  });

  it('should return true for partialy valid emails', () => {
    valids.forEach(email => {
      Array.from({ length: email.length }).forEach((_, i) => {
        const input = email.slice(0, i);

        const result = isEmailPartial(input);

        expect({ input, result }).toEqual({ input, result: true });
      });
    });
  });

  it('should return false for invalid email even if is partial', () => {
    invalids
      .filter(email => !partialValids.includes(email))
      .forEach(input => {
        const result = isEmailPartial(input);

        expect({ input, result }).toEqual({ input, result: false });
      });
  });

  it('should return true for a text with at least one digit', () => {
    const text = 'test123abc123';
    const expected = hasAtLeastOneDigit(text);

    expect(expected).toBe(true);
  });

  it('should return false for a text with at least one digit', () => {
    const text = 'test';
    const expected = hasAtLeastOneDigit(text);

    expect(expected).toBe(false);
  });
});
