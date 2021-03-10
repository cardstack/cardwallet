import Chance from 'chance';
import React from 'react';
import { render } from '@testing-library/react-native';
import * as shopifyRestyle from '@shopify/restyle';
import {
  CustomIconNames,
  customIcons,
} from '../../src/components/Icon/custom-icons';
import { Icon } from '../../src/components/Icon';

jest.mock('@shopify/restyle');
jest.mock('react-native-svg', () => ({
  SvgXml: jest.fn(() => null),
}));

const chance = new Chance();

describe('Icon', () => {
  const { useTheme } = shopifyRestyle as jest.Mocked<typeof shopifyRestyle>;

  let theme: any;

  beforeEach(() => {
    theme = {
      colors: {
        blue: chance.string(),
        red: chance.string(),
      },
    };

    useTheme.mockReturnValue(theme);
  });

  it('should render a custom icon if the name is in the custom icon object', () => {
    const name = chance.pickone<CustomIconNames>(
      Object.keys(customIcons) as CustomIconNames[]
    );

    const { getByTestId } = render(<Icon name={name} />);

    getByTestId('custom-icon');
  });
});
