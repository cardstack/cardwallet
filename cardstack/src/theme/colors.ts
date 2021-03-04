export const palette = {
  black: '#000000',
  blueDark: '#413E4E',
  blueText: '#6B6A80',
  blueLight: '#00EBE5',
  blueBorder: '#6B6A80',
  grayBackground: '#F7F7F7',
  borderGray: '#E8E8E8',
  grayDark: '#AFAFB7',
  grayLight: '#00EBE5',
  green: '#00AC3D',
  red: '#FF0000',
  transparent: 'transparent',
  white: '#FFFFFF',
};

export const colors = {
  backgroundGray: palette.grayBackground,
  backgroundBlue: palette.blueDark,
  black: palette.black,
  blue: palette.blueLight,
  blueText: palette.blueText,
  borderGray: palette.borderGray,
  borderBlue: palette.blueBorder,
  buttonPrimaryBackground: palette.grayLight,
  buttonPrimaryBorder: palette.grayLight,
  buttonSecondaryBackground: palette.white,
  buttonSecondaryBorder: palette.grayDark,
  grayBackground: palette.grayBackground,
  grayText: palette.grayDark,
  green: palette.green,
  red: palette.red,
  transparent: palette.transparent,
  white: palette.white,
};

export type ColorTypes = keyof typeof colors;