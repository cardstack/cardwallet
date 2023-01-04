import { get, isNil } from 'lodash';
import { css } from 'styled-components';
import fonts from './fonts';
import { Device } from '@cardstack/utils';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function selectBestFontFit(mono, weight) {
  if (weight) {
    if (weight === 900) {
      return 'Heavy';
    }
    if (weight >= 700) {
      return 'Bold';
    }
    if (weight >= 500) {
      return 'Semibold';
    }
    return weight <= 400
      ? 'Regular'
      : mono
      ? 'Medium'
      : capitalizeFirstLetter(weight);
  } else {
    return 'Regular';
  }
}

function familyFontWithAndroidWidth(weight, family, mono) {
  return `${
    fonts.family[
      mono
        ? `SFMono${
            Device.isAndroid ? `-${selectBestFontFit(mono, weight)}` : ''
          }`
        : family
    ]
  }${Device.isAndroid ? `-${selectBestFontFit(mono, weight)}` : ''}`;
}

const buildTextStyles = css`
  /* Color */
  color: ${({ color }) => color};

  /* Font Family */
  ${({ isEmoji, family = 'SFProRounded', mono, weight }) => {
    const t = isEmoji
      ? ''
      : `font-family: ${familyFontWithAndroidWidth(weight, family, mono)};`;
    return t;
  }}

  /* Font Size */
  font-size: ${({ size = 'medium' }) =>
    typeof size === 'number' ? size : get(fonts, `size[${size}]`, size)};

  /* Font Weight */
  ${({ isEmoji, weight = 'regular' }) =>
    isEmoji || isNil(weight) || Device.isAndroid
      ? ''
      : `font-weight: ${get(fonts, `weight[${weight}]`, weight)};`}

  /* Letter Spacing */
  ${({ letterSpacing = 'rounded' }) =>
    isNil(letterSpacing)
      ? ''
      : `letter-spacing: ${get(
          fonts,
          `letterSpacing[${letterSpacing}]`,
          letterSpacing
        )};`}

  /* Line Height */
  ${({ isEmoji, lineHeight }) =>
    isNil(lineHeight) || (isEmoji && Device.isAndroid)
      ? ''
      : `line-height: ${get(fonts, `lineHeight[${lineHeight}]`, lineHeight)};`}

  /* Opacity */
  ${({ opacity }) => (isNil(opacity) ? '' : `opacity: ${opacity};`)}

  /* Tabular Numbers */
  ${({ tabularNums }) => (tabularNums ? 'font-variant: tabular-nums;' : '')}

  /* Text Align */
  ${({ align }) => (isNil(align) ? '' : `text-align: ${align};`)}

  /* Uppercase */
  ${({ uppercase }) => (uppercase ? 'text-transform: uppercase;' : '')}
`;

export default buildTextStyles;
