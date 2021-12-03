import Chance from 'chance';
import React from 'react';

import { render } from '../../test-utils';
import { Button } from '../Button';
import { Icon } from '../Icon';

jest.mock('@cardstack/utils');

const chance = new Chance();

describe('Button', () => {
  it('should render the children', () => {
    const { getByText } = render(<Button>Hello, world!</Button>);
    getByText('Hello, world!');
  });

  // it.only('renders as primary variant', () => {
  //   const { debug, queryByTestId } = render(
  //     <Button variant="primary">Hello, world</Button>
  //   );

  //   // debug();
  //   expect(queryByTestId('button-text')).toHaveStyle({
  //     color: '#000000',
  //     display: 'flex',
  //     fontFamily: 'OpenSans-Regular',
  //     fontSize: 16,
  //   });
  // });

  // it.only('renders as primaryWhite variant', () => {
  //   const { debug, queryByTestId } = render(
  //     <Button variant="primaryWhite">Hello, world</Button>
  //   );

  //   debug();
  //   expect(queryByTestId('button-text')).toHaveStyle({
  //     color: '#000000',
  //     display: 'flex',
  //     fontFamily: 'OpenSans-Regular',
  //     fontSize: 16,
  //   });
  // });

  // TODO: figure out why variants are not working in tests
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('renders as extraSmall variant', () => {
    const { queryByTestId } = render(
      <Button variant="extraSmall">Hello, world</Button>
    );

    expect(queryByTestId('button-text')).toHaveStyle({
      fontSize: 12,
    });
  });

  it('should handle disabled styles', () => {
    const buttonText = 'Hello, world!';
    const { getByTestId } = render(<Button disabled>{buttonText}</Button>);
    // TODO: assert disabled styles
    getByTestId('disabledOverlay');
  });

  it('should render the icon if iconProps are passed', () => {
    const buttonText = chance.string();

    const iconProps: {
      [key: string]: any;
      name: 'pin';
    } = {
      [chance.string()]: chance.string(),
      name: 'pin',
    };

    render(<Button iconProps={iconProps}>{buttonText}</Button>);

    expect(Icon).toHaveBeenCalledTimes(1);
    expect(Icon).toHaveBeenCalledWith(expect.objectContaining(iconProps), {});
  });

  it('should render the icon with the correct color if iconProps and disabled', () => {
    const buttonText = chance.string();

    const iconProps: {
      [key: string]: any;
      name: 'pin';
    } = {
      [chance.string()]: chance.string(),
      name: 'pin',
    };

    render(
      <Button iconProps={iconProps} disabled>
        {buttonText}
      </Button>
    );

    expect(Icon).toHaveBeenCalledWith(
      expect.objectContaining({ color: 'blueText' }),
      {}
    );
  });

  it('should render an activity indicator when button is loading', () => {
    const buttonText = chance.string();

    const { getByTestId } = render(<Button loading>{buttonText}</Button>);

    getByTestId('button-loading');
  });
});
