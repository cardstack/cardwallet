/**
 * parseTemplateExplanation
 * Taken from https://gist.github.com/smeijer/6580740a0ff468960a5257108af1384e?permalink_comment_id=3437778#gistcomment-3437778
 * @param template string such as in explanationTemplate: Earned {amount} {token} for a one-time aidrop. {rollover_amount} tokens.
 * @param data obejct such as explanationData: { "amount": "100.0", "token": "0xB0427e9F03Eb448D030bE3EBC96F423857ceEb2f" }
 * @returns formatted string such as: Earned 100.0 CARD.CPXD for a one-time aidrop. {rollover_amount} tokens.
 */
export const parseTemplateExplanation = (template: string, data: any) => {
  return template.replace(
    /\{([^}]+)}/g,
    (m, p) =>
      p.split('.').reduce((a: any, f: any) => (a ? a[f] : undefined), data) ?? m
  );
};
