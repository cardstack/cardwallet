import { cardSpaceDomain } from '@cardstack/constants';

export const MIN_SLUG_LENGTH = 4;

export const strings = {
  header: 'Choose a unique ID that others can use to send you money',
  purchaseDisclaimer: (price: string) =>
    `Creating a payment profile will require a one-time ${price} fee.`,
  input: {
    domainSuffix: cardSpaceDomain,
    description:
      'This unique ID will be used to identify your payment profile. Please note this ID cannot be changed once the profile is created and may be used as a contact address.',
  },
  errors: {
    minLength: `ID must be at least ${MIN_SLUG_LENGTH} characters long`,
    noApiResponse: 'Unable to validate ID, try again later',
  },
  buttons: {
    continue: 'Continue',
  },
};
