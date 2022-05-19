import { ColorTypes } from '.';

export type ThemeVariant = 'dark' | 'light';

type ColorVariants = Record<ThemeVariant, ColorTypes>;

type StyleProps =
  | 'backgroundColor'
  | 'borderColor'
  | 'textColor'
  | 'secondaryTextColor';

export const colorStyleVariants: Record<StyleProps, ColorVariants> = {
  backgroundColor: {
    light: 'white',
    dark: 'backgroundDarkPurple',
  },
  borderColor: {
    light: 'buttonDarkBackground',
    dark: 'secondaryText',
  },
  textColor: {
    light: 'black',
    dark: 'white',
  },
  secondaryTextColor: {
    light: 'secondaryText',
    dark: 'grayText',
  },
};
