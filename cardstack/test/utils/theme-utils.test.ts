import * as shopifyRestyle from '@shopify/restyle';
import Chance from 'chance';
import { Dimensions } from 'react-native';
import { breakpoints } from '../../src/theme/breakpoints';
import { useVariantValue } from '../../src/utils/theme-utils';

const chance = new Chance();

jest.mock('@shopify/restyle');
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => ({
    width: 401,
  })),
}));

describe('theme utils', () => {
  const { useTheme } = shopifyRestyle as jest.Mocked<typeof shopifyRestyle>;
  const mockDimensions = Dimensions as any;

  const theme = {
    buttonVariants: {
      defaults: {
        textStyle: {
          [chance.string()]: chance.string(),
        },
        width: chance.natural(),
      },
      secondary: {
        textStyle: {
          [chance.string()]: chance.string(),
        },
        width: chance.natural(),
      },
      primary: {
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

    it('should pull the correct width off of the theme if no variant is passed and value is not an object', () => {
      const width = useVariantValue('buttonVariants', 'width', undefined);

      expect(width).toEqual(theme.buttonVariants.defaults.width);
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

    it('should pull the correct width off of the theme if secondary is passed and value is not an object', () => {
      const width = useVariantValue('buttonVariants', 'width', 'secondary');

      expect(width).toEqual(theme.buttonVariants.secondary.width);
    });

    it('should pull the correct textStyle off of the theme if a responsive value is passed', () => {
      const textStyle = useVariantValue('buttonVariants', 'textStyle', {
        phone: 'secondary',
        tablet: 'primary',
      });

      expect(textStyle).toEqual({
        ...theme.buttonVariants.defaults.textStyle,
        ...theme.buttonVariants.secondary.textStyle,
      });
    });

    it('should pull the correct width off of the theme if the variant passed does not have the value', () => {
      const width = useVariantValue('buttonVariants', 'width', 'primary');

      expect(width).toEqual(theme.buttonVariants.defaults.width);
    });

    it('should pull the correct textStyle off of the theme if an undefined responsive variable is passed', () => {
      const textStyle = useVariantValue('buttonVariants', 'textStyle', {
        phone: undefined,
        tablet: 'primary',
      });

      expect(textStyle).toEqual({
        ...theme.buttonVariants.defaults.textStyle,
      });
    });

    it('should pull the correct textStyle off of the theme if responsive values are passed and width is set for tablet', () => {
      mockDimensions.get.mockReturnValue({
        width: breakpoints.tablet + 1,
      });

      const textStyle = useVariantValue('buttonVariants', 'textStyle', {
        phone: 'secondary',
        tablet: 'primary',
      });

      expect(textStyle).toEqual({
        ...theme.buttonVariants.defaults.textStyle,
        ...theme.buttonVariants.primary.textStyle,
      });
    });
  });
});
