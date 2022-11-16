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
  bannerTitle: {
    fontSize: 16,
    letterSpacing: 0.4,
    ...fontFamilyVariants.bold,
  },
  bannerDescription: {
    fontSize: 13,
    letterSpacing: 0.33,
    ...fontFamilyVariants.regular,
  },
  semibold: {
    letterSpacing: 0.13,
    ...fontFamilyVariants.semiBold,
  },
  bold: {
    ...fontFamilyVariants.bold,
  },
  pageHeader: {
    color: 'white',
    fontSize: 24,
    ...fontFamilyVariants.light,
  },
  pageDescriptionSmall: {
    color: 'grayText',
    fontSize: 12,
  },
  floatingTag: {
    fontSize: 9,
    letterSpacing: 0.9,
    fontWeight: '700',
    textTransform: 'uppercase',
    ...fontFamilyVariants.bold,
  },
  promoBannerTitle: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textAlign: 'center',
    ...fontFamilyVariants.semiBold,
  },
};
