import { screenWidth } from '../utils/dimension-utils';

const blue = {
  backgroundColor: 'backgroundBlue',
  borderColor: 'borderBlue',
  textStyle: {
    color: 'buttonPrimaryBackground',
  },
};

const small = {
  textStyle: {
    fontSize: 14,
  },
  width: (screenWidth - 56) / 2,
};

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
    paddingVertical: 3,
    textStyle: {
      variant: 'body',
      fontWeight: '600',
    },
    width: screenWidth - 40,
  },
  secondary: {
    backgroundColor: 'buttonSecondaryBackground',
    borderColor: 'buttonSecondaryBorder',
  },
  blue,
  small,
  smallBlue: {
    ...small,
    ...blue,
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
