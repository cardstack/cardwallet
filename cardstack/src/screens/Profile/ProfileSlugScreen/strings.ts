export const MIN_USERNAME_LENGTH = 4;

export const strings = {
  header: 'Choose a unique ID that others can use to send you money',
  input: {
    domainSuffix: '.card.xyz',
    description:
      'This unique ID will be used to identify your payment profile. Please note this ID cannot be changed once the profile is created and may be used as a contact address.',
  },
  errors: {
    minLength: `ID must be at least ${MIN_USERNAME_LENGTH} characters long`,
    noApiResponse: 'Unable to validate ID, try again later',
  },
  buttons: {
    continue: 'Continue',
  },
};
