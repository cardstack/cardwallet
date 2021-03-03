import { screenWidth } from '../utils/dimension-utils';

export const buttonVariants = {
  defaults: {
    backgroundColor: 'buttonPrimaryBackground',
    borderColor: 'buttonPrimaryBorder',
    borderRadius: 100,
    borderWidth: 1,
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
};

export type ButtonVariants = keyof typeof buttonVariants;
