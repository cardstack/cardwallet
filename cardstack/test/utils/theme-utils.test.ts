import * as shopifyRestyle from '@shopify/restyle';
import Chance from 'chance';
import { useVariantValue } from '@cardstack/utils';

const chance = new Chance();

jest.mock('@shopify/restyle');

describe('theme utils', () => {
  const { useTheme } = shopifyRestyle as jest.Mocked<typeof shopifyRestyle>;

  const theme = {
    buttonVariants: {
      defaults: {
        textStyle: {
          [chance.string()]: chance.string(),
        },
      },
      secondary: {
        textStyle: {
          [chance.string()]: chance.string(),
        },
      },
    },
  };

  describe('useVariantValue', () => {
    beforeEach(() => {
      useTheme.mockReturnValue(theme);
    });

    it('should pull the correct textStyle off of the theme if no variant is passed', () => {
      const textStyle = useVariantValue(
        'buttonVariants',
        'textStyle',
        undefined
      );

      expect(textStyle).toEqual({
        ...theme.buttonVariants.defaults.textStyle,
      });
    });

    it('should pull the correct textStyle off of the theme if secondary is passed', () => {
      const textStyle = useVariantValue(
        'buttonVariants',
        'textStyle',
        'secondary'
      );

      expect(textStyle).toEqual({
        ...theme.buttonVariants.defaults.textStyle,
        ...theme.buttonVariants.secondary.textStyle,
      });
    });

    it('should pull the correct textStyle off of the theme if a responsive value is passed', () => {
      const textStyle = useVariantValue('buttonVariants', 'textStyle', {
        phone: 'secondary',
        tablet: 'blue',
      });

      expect(textStyle).toEqual({
        ...theme.buttonVariants.defaults.textStyle,
        ...theme.buttonVariants.secondary.textStyle,
      });
    });

    it('should pull the correct textStyle off of the theme if an undefined responsive variable is passed', () => {
      const textStyle = useVariantValue('buttonVariants', 'textStyle', {
        phone: undefined,
        tablet: 'blue',
      });

      expect(textStyle).toEqual({
        ...theme.buttonVariants.defaults.textStyle,
      });
    });
  });
});
