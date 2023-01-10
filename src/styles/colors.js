import chroma from 'chroma-js';

import { avatarColor } from '@cardstack/theme';

const buildRgba = (color, alpha = 1) => `rgba(${chroma(color).rgb()},${alpha})`;

const colors = {
  appleBlue: '#0E76FD', // '14, 118, 253'
  black: '#000000', // '0, 0, 0'
  blueGreyDark: '#3C4252', // '60, 66, 82'
  blueGreyDark50: '#9DA0A8', // this color is blueGreyDark at 50% over white
  dark: '#25292E', // '37, 41, 46'
  green: '#2CCC00', // '58, 166, 134'
  grey: '#A9ADB9', // '169, 173, 185'
  lighterGrey: '#F7F7F8', // '247, 247, 248'
  lightestGrey: '#E9EBEF', // '238, 233, 232'
  orange: '#FF9900', // '255, 153, 0'
  rowDivider: 'rgba(60, 66, 82, 0.03)', // '60, 66, 82, 0.03'
  rowDividerExtraLight: 'rgba(60, 66, 82, 0.015)', // '60, 66, 82, 0.015'
  rowDividerLight: 'rgba(60, 66, 82, 0.02)', // '60, 66, 82, 0.02'
  shadow: '#25292E', // '37, 41, 46'
  shimmer: '#EDEEF1', // '237, 238, 241'
  skeleton: '#F6F7F8', // '246, 247, 248'
  white: '#FFFFFF', // '255, 255, 255'
  whiteLabel: '#FFFFFF', // '255, 255, 255'
  yellowOrange: '#FFC400', // '255, 196, 0'
  gradients: {
    lighterGrey: [buildRgba('#ECF1F5', 0.15), buildRgba('#DFE4EB', 0.5)],
    sendBackground: ['#FAFAFA00', '#FAFAFAFF'],
  },
  sendScreen: {
    grey: '#D8D8D8', // '216, 216, 216'
  },
  alpha: buildRgba,
};

const isColorLight = targetColor =>
  chroma(targetColor || colors.white).luminance() > 0.5;

const getTextColorForBackground = (targetColor, textColors = {}) => {
  const { dark = colors.black, light = colors.white } = textColors;

  return isColorLight(targetColor) ? dark : light;
};

const getFallbackTextColor = bg =>
  colors.getTextColorForBackground(bg, {
    dark: colors.alpha(colors.blueGreyDark, 0.5),
    light: colors.whiteLabel,
  });

export const getRandomColor = () =>
  Math.floor(Math.random() * avatarColor.length);

export default {
  ...colors,
  getTextColorForBackground,
  getFallbackTextColor,
  getRandomColor,
};
