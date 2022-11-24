import {
  parseTemplateExplanation,
  parseExplanationAmount,
} from '../reward-explanation';

describe('Rewards explanation', () => {
  it('should parse a proof template with a single value data entry', () => {
    const template = 'Template {a}';
    const data = { a: 'Value A' };

    expect(parseTemplateExplanation(template, data)).toBe('Template Value A');
  });

  it('should parse whatever values match and keep not defined values as is', () => {
    const template = 'Template {a} {b}';
    const data = { a: 'Value A' };

    expect(parseTemplateExplanation(template, data)).toBe(
      'Template Value A {b}'
    );
  });

  it('should not parse values that do not correlate to the ones defined in the template', () => {
    const template = 'Template {a}';
    const data = { b: 'Value B' };

    expect(parseTemplateExplanation(template, data)).toBe('Template {a}');
  });

  it('should return the template as is if no data is provided', () => {
    const template = 'Template {a}';

    expect(parseTemplateExplanation(template, undefined)).toBe('Template {a}');
  });

  it('should return the template replaced for sub layered values', () => {
    const template = 'Template {a.b}';
    const data = { a: { b: 'Value B' } };

    expect(parseTemplateExplanation(template, data)).toBe('Template Value B');
  });

  it('should parse WEI amount to human readable string with default 2 decimals', () => {
    const wei = '3498646326433040826368';
    const token = '3498.65';

    expect(parseExplanationAmount(wei)).toBe(token);
  });

  it('should parse WEI amount to human readable string with defined decimals', () => {
    const wei = '3498646326433040826368';
    const token = '3498.646';

    expect(parseExplanationAmount(wei, 3)).toBe(token);
  });
});
