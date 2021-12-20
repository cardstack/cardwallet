export const palette = {
  black: '#000000',
  blackEerie: '#1f1f1f',
  blueBright: '#6638FF',
  blueOcean: '#0069f9',
  tealLight: '#00EBE5',
  tealDark: '#03C4BF',
  green: '#00AC3D',
  lightGreen: '#37EB77',
  red: '#FF0000',
  redDark: '#FF5050',
  blueDarkest: '#393642',
  blueDark: '#413E4E',
  blueText: '#6B6A80',
  blueBorder: '#6B6A80',
  blueLightBorder: '#a6d3fb',
  grayMostDark: '#666666',
  grayMediumDark: '#9A9A9A',
  grayDark: '#AFAFB7',
  grayLessDark: '#B3B1B8',
  grayMediumLight: '#D1D1D1',
  grayBackgroundLight: '#DEDEDE',
  borderGray: '#E8E8E8',
  darkGray: '#423e4f',
  skeletonGray: '#E1E1E8',
  grayBackground: '#F7F7F7',
  white: '#FFFFFF',
  transparent: 'transparent',
  grayCardBackground: '#F8F7FA',
  blackOpacity50: '#00000080',
  blackLightOpacity: '#00000066',
  whiteOpacity50: '#FFFFFF80',
  grayButtonBackground: '#D1D5DB',
  buttonDisabledBackground: '#2e2d38',
  appleBlue: '#0E76FD',
};

export const colors = {
  backgroundGray: palette.grayBackground,
  backgroundLightGray: palette.grayBackgroundLight,
  backgroundBlue: palette.blueDark,
  brightBlue: palette.blueBright,
  black: palette.black,
  blackEerie: palette.blackEerie,
  teal: palette.tealLight,
  tealDark: palette.tealDark,
  blueOcean: palette.blueOcean,
  blueText: palette.blueText,
  borderGray: palette.borderGray,
  borderBlue: palette.blueBorder,
  blueLightBorder: palette.blueLightBorder,
  buttonPrimaryBackground: palette.tealLight,
  buttonPrimaryBorder: palette.tealLight,
  buttonSecondaryBackground: palette.white,
  buttonSecondaryBorder: palette.grayDark,
  buttonDarkBackground: palette.grayDark,
  grayBackground: palette.grayBackground,
  grayText: palette.grayDark,
  settingsTeal: palette.tealDark,
  settingsGrayDark: palette.grayMostDark,
  settingsGrayChevron: palette.grayLessDark,
  green: palette.green,
  lightGreen: palette.lightGreen,
  red: palette.red,
  invalid: palette.redDark,
  overlayGray: palette.darkGray,
  transparent: palette.transparent,
  white: palette.white,
  underlineGray: palette.grayMediumLight,
  spendableBalance: palette.blueDarkest,
  networkBadge: palette.blueDarkest,
  darkGrayText: palette.grayMediumDark,
  lightSkeleton: palette.skeletonGray,
  grayCardBackground: palette.grayCardBackground,
  overlay: palette.blackOpacity50,
  whiteOverlay: palette.whiteOpacity50,
  blackLightOpacity: palette.blackLightOpacity,
  grayButtonBackground: palette.grayButtonBackground,
  buttonDisabledBackground: palette.buttonDisabledBackground,
  appleBlue: palette.appleBlue,
};

export const avatarColor = [
  '#FF494A', // '255, 73, 74'
  '#01D3FF', // '2, 211, 255'
  '#FB60C4', // '251, 96, 196'
  '#3F6AFF', // '63, 106, 255'
  '#FFD963', // '255, 217, 99'
  '#B140FF', // '177, 64, 255'
  '#41EBC1', // '64, 235, 193'
  '#F46E38', // '244, 110, 56'
  '#6D7E8F', // '109, 126, 143'
];

export type ColorTypes = keyof typeof colors;
