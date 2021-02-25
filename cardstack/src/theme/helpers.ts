import { ResponsiveValue, SafeVariants, useTheme } from '@shopify/restyle';

import { Theme } from './';

/**
 * Gets the variant value while taking into account responsive values
 */
const getVariantValue = <T extends keyof SafeVariants<Theme>>(
  variant?: ResponsiveValue<keyof Omit<Theme[T], 'defaults'>, Theme>
) => {
  const variantObjectOrString = variant || 'defaults';

  const variantString =
    typeof variantObjectOrString === 'string'
      ? variantObjectOrString
      : // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        variantObjectOrString.phone; // The type def for this isn't working yet and I haven't figured out why yet

  return variantString || 'defaults';
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
  const theme = useTheme();
  const variant = getVariantValue(responsiveVariantValue);
  const variantObject = theme[themeKey];
  const defaultStyles = variantObject.defaults || {};

  if (variantObject) {
    const variantStyles = variantObject[variant];

    return {
      ...(defaultStyles[key] || {}),
      ...variantStyles[key],
    };
  }

  return defaultStyles[key] || {};
};
