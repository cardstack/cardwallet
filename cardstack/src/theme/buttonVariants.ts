import { screenWidth } from '../utils/dimension-utils';

const blue = {
  backgroundColor: 'backgroundBlue',
  borderColor: 'borderBlue',
  textStyle: {
    color: 'buttonPrimaryBackground',
  },
};

const secondary = {
  backgroundColor: 'buttonSecondaryBackground',
  borderColor: 'buttonSecondaryBorder',
};

const small = {
  textStyle: {
    fontSize: 14,
  },
  width: (screenWidth - 56) / 2,
};

const extraSmall = {
  height: 27,
  paddingVertical: 0,
  width: 72,
  textStyle: {
    variant: 'smallButton',
  },
};

const dark = {
  backgroundColor: 'buttonDarkBackground',
  borderColor: 'transparent',
  textStyle: {
    color: 'blueText',
  },
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
  secondary: { ...secondary },
  dark,
  blue,
  small,
  smallBlue: {
    ...small,
    ...blue,
  },
  smallSecondary: {
    ...small,
    ...secondary,
  },
  extraSmallDark: {
    ...extraSmall,
    ...dark,
    textStyle: {
      ...extraSmall.textStyle,
      ...dark.textStyle,
    },
  },
  extraSmall,
  square: {
    ...blue,
    height: 92,
    width: 92,
    borderRadius: 20,
    textStyle: {
      ...blue.textStyle,
      fontWeight: '700',
      fontSize: 26,
    },
  },
};

export type ButtonVariants = keyof typeof buttonVariants;
