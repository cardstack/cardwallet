import Chance from 'chance';
import React from 'react';

import { fireEvent, render } from '../../test-utils';
import { OptionItem } from '../OptionItem';

jest.mock('@cardstack/components/Icon', () => ({
  Icon: jest.fn(() => null),
}));

const chance = new Chance();

describe('OptionItem', () => {
  let props: any;

  const renderComponent = () => render(<OptionItem {...props} />);

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
    const { getByText } = renderComponent();

    getByText(props.title);
  });

  it('should render a touchable with onPress', () => {
    const { getByTestId } = renderComponent();

    const touchable = getByTestId('option-item');

    fireEvent.press(touchable);

    expect(props.onPress).toHaveBeenCalledTimes(1);
  });

  it('should render the subtext if it is passed', () => {
    props.subText = chance.string();

    const { getByText } = renderComponent();

    getByText(props.subText);
  });

  it('should render the icon border if borderIcon is true', () => {
    props.borderIcon = true;

    const { getByTestId } = renderComponent();

    const iconWrapper = getByTestId('option-item-icon-wrapper');

    expect(iconWrapper).toHaveStyle({ borderWidth: 1 });
  });
});
