export const strings = {
  header: {
    profile: 'Profile',
  },
  stepOne: {
    createProfile: 'Create a Profile',
    createProfileDesc: 'All users need a profile to send and receive payments.',
    example: 'Example:',
  },
  stepTwo: {
    nameAndIdForProfile: 'Name and ID for Profile',
    businessName: 'Name (or Business Name)',
    uniqueId: 'Unique ID',
    businessIdAvailable: 'This ID is available',
    uniqueIdDescription:
      'This is a unique ID that will be used to identify your payment profile. Please note this ID cannot be changed once the profile is created and can be used as a contact address.',
    required: 'required',
    iconColor: 'Profile Color',
  },
  stepThree: {
    review: 'Review',
    reviewDescription:
      'Next you will confirm the creation of your profile. This will require a payment of \n$1.00 USD.',
    yourProfile: 'Your Profile:',
  },
  validation: {
    thisFieldIsRequied: 'This field is required',
    businessIdShouldBeUnique:
      'This Business ID is already taken. Please choose another one',
    createProfileErrorMessage:
      'Could not create profile, please try again. If this problem persists please reach out to support@cardstack.com',
    profileIdLengthError: 'Profile ID must be at least 4 characters',
  },
  notification: {
    profileCreated: 'Profile Created',
    profileCreatedMessage: 'Your profile has been created successfully!',
    creatingProfile: 'Creating Profile',
  },
  buttons: {
    continue: 'Continue',
    completeToContinue: 'Complete to Continue',
    create: 'Create',
  },
};

export const exampleMerchantData = {
  accumulatedSpendValue: '0',
  address: '0x45abXXXX2Bc2',
  infoDID: '',
  merchantInfo: {
    color: '#ff0000',
    did: '',
    name: 'Mandello',
    ownerAddress: '',
    slug: 'mandello',
    textColor: '#fff',
  },
  owners: [''],
  revenueBalances: [],
  tokens: [],
  type: 'merchant',
};
