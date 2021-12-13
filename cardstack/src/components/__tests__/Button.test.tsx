import React from 'react';
import { render } from '../../test-utils';
import { Button } from '../Button/Button';

describe('Button', () => {
  it('should render the children', () => {
    const { getByText } = render(<Button>Hello world!</Button>);
    getByText('Hello world!');
  });

  //TODO: test rendering secondary variant
  //TODO: test rendering tertiary variant
  //TODO: test rendering small variant
  //TODO: test rendering extraSmall variant

  it('should handle disabled styles', () => {
    const { getByTestId } = render(<Button disabled>Not Enabled</Button>);
    //TODO: verify disabled button variant styles are applied
    getByTestId('disabledOverlay');
  });

  it('should render the icon if iconProps are passed', () => {
    const { getByTestId } = render(
      <Button
        iconProps={{
          iconSize: 'medium',
          marginRight: 2,
          name: 'camera',
        }}
      >
        With Icon
      </Button>
    );

    //TODO: verify styles if icon are applied
    getByTestId('icon-camera');
  });

  //TODO: verify disabled button with icon and confirm correct icon color is applied

  it('should render an activity indicator when button is loading', () => {
    const { getByTestId } = render(<Button loading>Please wait</Button>);
    getByTestId('button-loading');
  });
});
