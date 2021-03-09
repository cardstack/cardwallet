import { screenWidth } from '../utils/dimension-utils';

export const buttonVariants = {
  defaults: {
    alignItems: 'center',
    backgroundColor: 'buttonPrimaryBackground',
    borderColor: 'buttonPrimaryBorder',
    borderRadius: 100,
    borderWidth: 1,
    disabledTextStyle: {
      color: 'blueText',
    },
    flexDirection: 'row',
    justifyContent: 'center',
    maxWidth: 335,
    paddingVertical: 3,
    textStyle: {
      variant: 'body',
      fontWeight: '600',
    },
    width: screenWidth - 32,
  },
  secondary: {
    backgroundColor: 'buttonSecondaryBackground',
    borderColor: 'buttonSecondaryBorder',
  },
  blue: {
    backgroundColor: 'backgroundBlue',
    borderColor: 'borderBlue',
    textStyle: {
      color: 'white',
    },
  },
  small: {
    width: (screenWidth - 48) / 2,
  },
  extraSmall: {
    height: 27,
    paddingVertical: 0,
    width: 72,
    textStyle: {
      variant: 'smallButton',
    },
  },
};

export type ButtonVariants = keyof typeof buttonVariants;
