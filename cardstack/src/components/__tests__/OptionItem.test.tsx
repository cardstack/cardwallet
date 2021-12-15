import Chance from 'chance';
import React from 'react';

import { fireEvent, render } from '../../test-utils';
import { OptionItem } from '../OptionItem';

const chance = new Chance();

describe('OptionItem', () => {
  let props: any;

  beforeEach(() => {
    props = {
      onPress: jest.fn(),
      iconProps: {
        name: chance.pickone(['plus', 'download']),
      },
      title: chance.string(),
      textProps: {
        [chance.string()]: chance.string(),
      },
    };
  });

  it('should render the title', () => {
    const { getByText } = render(<OptionItem {...props} />);

    getByText(props.title);
  });

  it('should render a touchable with onPress', () => {
    const { getByTestId } = render(<OptionItem {...props} />);

    const touchable = getByTestId('option-item');

    fireEvent.press(touchable);

    expect(props.onPress).toHaveBeenCalledTimes(1);
  });

  it('should render the subtext if it is passed', () => {
    props.subText = chance.string();

    const { getByText } = render(<OptionItem {...props} />);

    getByText(props.subText);
  });

  it('should render the icon border if borderIcon is true', () => {
    props.borderIcon = true;

    const { getByTestId } = render(<OptionItem {...props} />);

    const iconWrapper = getByTestId('option-item-icon-wrapper');

    expect(iconWrapper).toHaveStyle({ borderWidth: 1 });
  });

  it('should render in a disabled state when disabled', () => {
    props.disabled = true;
    const { getByTestId } = render(<OptionItem {...props} />);
    expect(getByTestId('option-item')).toBeDisabled();
  });

  it('should render in a disabled state when no onPress', () => {
    props.onPress = undefined;
    const { getByTestId } = render(<OptionItem {...props} />);
    expect(getByTestId('option-item')).toBeDisabled();
  });
});
