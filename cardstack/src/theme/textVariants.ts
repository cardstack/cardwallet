import { fontFamilyVariants } from './fontFamilyVariants';

const baseText = {
  fontSize: 16,
  color: 'black',
};

export const textVariants = {
  defaults: { ...baseText, ...fontFamilyVariants.regular },
  body: { ...baseText, ...fontFamilyVariants.regular },
  tabBar: {
    fontSize: 10,
    letterSpacing: 0.1,
    ...fontFamilyVariants.bold,
  },
  xsGrey: {
    color: 'grayText',
    fontSize: 7,
  },
  smallGrey: {
    color: 'grayText',
    fontSize: 10,
  },
  smallButton: {
    fontSize: 12,
  },
  subText: {
    color: 'blueText',
    fontSize: 13,
  },
  subAddress: {
    color: 'blueText',
    fontSize: 14,
    ...fontFamilyVariants.regular,
  },
  welcomeScreen: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    ...fontFamilyVariants.bold,
  },
  overGradient: {
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowColor: 'white',
    textShadowRadius: 0,
  },
};
