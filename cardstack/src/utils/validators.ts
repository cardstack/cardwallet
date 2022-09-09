const emailTester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
const partialEmailTester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*(?!@[\.\-])(@[a-zA-Z0-9]?)?((?!(\-\.|\.\.))-*\.?[a-zA-Z0-9]?)*\.?([a-zA-Z](-?[a-zA-Z0-9])+)?$/;

const isBaseEmailValid = (email: string) => {
  if (email.length > 254) {
    return false;
  }

  const parts = email.split('@');

  if (parts[0].length > 64) {
    return false;
  }

  if (parts.length > 1) {
    const domainParts = parts[1].split('.');

    if (domainParts?.some(part => part.length > 63)) {
      return false;
    }
  }

  return true;
};

export const isEmailValid = (email: string) => {
  if (!email || !emailTester.test(email)) {
    return false;
  }

  return isBaseEmailValid(email);
};

export const isEmailPartial = (email: string): boolean => {
  const result = partialEmailTester.exec(email) || [];

  if (!result.length) {
    return !email; // empty string is allowed
  }

  if (!isBaseEmailValid(email)) {
    return false;
  }

  return result[0] === email;
};

export const matchMinLength = (text: string, minLength: number): boolean =>
  text.length >= minLength;

export const hasAtLeastOneDigit = (text: string): boolean => /\d/.test(text);
