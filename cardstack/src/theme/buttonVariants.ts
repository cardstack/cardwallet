import { screenWidth } from '../utils/dimension-utils';

const primary = {
  backgroundColor: 'transparent',
  borderColor: 'borderBlue',
  textStyle: {
    color: 'teal',
  },
};

const white = {
  backgroundColor: 'white',
  borderColor: 'buttonSecondaryBorder',
};

const secondary = {
  backgroundColor: 'buttonSecondaryBackground',
  borderColor: 'buttonSecondaryBorder',
};

const tertiary = {
  backgroundColor: 'black',
  borderColor: 'black',
  textStyle: {
    color: 'white',
  },
};

const small = {
  textStyle: {
    fontSize: 14,
  },
  width: (screenWidth - 56) / 2,
};

const extraSmall = {
  width: (screenWidth - 56) / 4,
  paddingHorizontal: 0,
  textStyle: {
    variant: 'smallButton',
  },
};

const tiny = {
  height: 27,
  paddingVertical: 0,
  ...extraSmall,
};

const dark = {
  backgroundColor: 'buttonDarkBackground',
  borderColor: 'transparent',
  textStyle: {
    color: 'blueText',
  },
};

const invalid = {
  backgroundColor: 'invalid',
  borderColor: 'transparent',
  textStyle: {
    color: 'white',
  },
  disabledTextStyle: {
    color: 'white',
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
  tertiary: { ...tertiary },
  dark,
  primary,
  small,
  white,
  smallBlue: {
    ...small,
    ...primary,
  },
  smallSecondary: {
    ...small,
    ...secondary,
  },
  smallTertiary: {
    ...small,
    ...tertiary,
  },

  tinyDark: {
    ...tiny,
    ...dark,
    textStyle: {
      ...extraSmall.textStyle,
      ...dark.textStyle,
    },
  },
  extraSmallTertiary: {
    ...extraSmall,
    ...tertiary,
  },
  extraSmall: {
    ...extraSmall,
  },
  tiny,
  invalid: { ...invalid },
  square: {
    ...primary,
    height: 92,
    width: 92,
    borderRadius: 20,
    textStyle: {
      ...primary.textStyle,
      fontWeight: '700',
      fontSize: 26,
    },
  },
};

export type ButtonVariants = keyof typeof buttonVariants;
