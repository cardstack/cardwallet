import {
  BaseTheme,
  createRestyleFunction,
  ResponsiveValue,
} from '@shopify/restyle';

import { Theme } from '@cardstack/theme';

export type CustomTextProps<Theme extends BaseTheme> = {
  size?: ResponsiveValue<keyof Theme['fontSizes'], Theme>;
  weight?: ResponsiveValue<keyof Theme['fontWeights'], Theme>;
};

export const customText = [
  createRestyleFunction({
    property: 'weight',
    styleProperty: 'fontWeight',
    transform: ({
      value,
      theme,
    }: {
      value: keyof Theme['fontWeights'];
      theme: Theme;
    }) => theme.fontWeights[value],
  }),
  createRestyleFunction<Theme>({
    property: 'size',
    styleProperty: 'fontSize',
    transform: ({
      value,
      theme,
    }: {
      value: keyof Theme['fontSizes'];
      theme: Theme;
    }) => theme.fontSizes[value],
  }),
];
