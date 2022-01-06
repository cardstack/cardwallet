import React from 'react';
import { render } from '../../test-utils';
import { Button } from '../Button/Button';
import { palette } from '@cardstack/theme';

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

    const style = getByTestId('animated-pressable').props.style[0];

    expect(style.backgroundColor).toEqual(palette.grayDark);
  });

  it('should handle disabled state', () => {
    const { getByTestId } = render(<Button disabled>Not Enabled</Button>);

    const button = getByTestId('animated-pressable');

    expect(button).toBeDisabled();
  });

  it('should be disabled on press but not on style', () => {
    const { getByTestId } = render(<Button disablePress>Not Enabled</Button>);

    const button = getByTestId('animated-pressable');
    const style = getByTestId('animated-pressable').props.style[0];

    expect(button).toBeDisabled();
    expect(style.backgroundColor).not.toEqual(palette.grayDark);
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
