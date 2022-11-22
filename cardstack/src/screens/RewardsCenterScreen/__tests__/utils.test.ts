import { parseTemplateExplanation } from '../utils';

describe('Rewards explanation', () => {
  it('should parse a proof template with a single value data entry', () => {
    const template = 'Template {a}';
    const data = { a: 'Value A' };

    expect(parseTemplateExplanation(template, data)).toMatch(
      'Template Value A'
    );
  });

  it('should parse whatever values match and keep not defined values as is', () => {
    const template = 'Template {a} {b}';
    const data = { a: 'Value A' };

    expect(parseTemplateExplanation(template, data)).toMatch(
      'Template Value A {b}'
    );
  });

  it('should not parse values that do not correlate to the ones defined in the template', () => {
    const template = 'Template {a}';
    const data = { b: 'Value B' };

    expect(parseTemplateExplanation(template, data)).toMatch('Template {a}');
  });

  it('should return the template as is if no data is provided', () => {
    const template = 'Template {a}';

    expect(parseTemplateExplanation(template, undefined)).toMatch(
      'Template {a}'
    );
  });
});
