import { ResponsiveValue, SafeVariants, useTheme } from '@shopify/restyle';
import chroma from 'chroma-js';
import { Dimensions } from 'react-native';

import { Theme, breakpoints, colors } from '@cardstack/theme';

/**
 * Gets the variant value while taking into account responsive values
 */
const getVariantValue = <T extends keyof SafeVariants<Theme>>(
  variant?: ResponsiveValue<keyof Omit<Theme[T], 'defaults'>, Theme>
) => {
  if (!variant) {
    return 'defaults';
  }

  if (typeof variant === 'object') {
    const sortedEntries = Object.entries(breakpoints).sort(
      (a, b) => b[1] - a[1]
    ) as [keyof typeof breakpoints, number][];

    const width = Dimensions.get('window').width;

    for (let i = 0; i < sortedEntries.length; i++) {
      const [key, value] = sortedEntries[i];

      if (width > value) {
        return variant[key] || 'defaults';
      }
    }
  }

  return variant;
};

/**
 * Pull a key off of the variant styles
 */
export const useVariantValue = <T extends keyof SafeVariants<Theme>>(
  themeKey: T,
  key: string,
  responsiveVariantValue?: ResponsiveValue<
    keyof Omit<Theme[T], 'defaults'>,
    Theme
  >
) => {
  const { variantStyles, defaultStyles } = useVariantStyle(
    themeKey,
    responsiveVariantValue
  );

  const value = variantStyles[key];

  if (typeof value === 'object') {
    return { ...defaultStyles[key], ...value };
  }

  return value || defaultStyles[key];
};

/**
 * Pull the variant styles
 */
export const useVariantStyle = <T extends keyof SafeVariants<Theme>>(
  themeKey: T,
  responsiveVariantValue?: ResponsiveValue<
    keyof Omit<Theme[T], 'defaults'>,
    Theme
  >
) => {
  const theme = useTheme();
  const variant = getVariantValue(responsiveVariantValue);

  const variantObject = theme[themeKey];
  const defaultStyles = variantObject.defaults;
  const variantStyles = variantObject[variant];

  return {
    variantStyles,
    defaultStyles,
    mergedStyles: { ...defaultStyles, ...variantStyles },
  };
};

/**
 * Calculates using chroma API if a text should be white or black
 * if placed above a background color.
 */
export const contrastingTextColor = (color: string) =>
  chroma(color).luminance() > 0.5 ? colors.black : colors.white;
