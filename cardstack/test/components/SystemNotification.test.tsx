import Chance from 'chance';
import React from 'react';

import { fireEvent, render, waitFor, act } from '../test-utils';
import { AnimatedText } from '../../src/components/Animated';
import {
  SystemNotification,
  SystemNotificationProps,
} from '@cardstack/components';

jest.mock('../../../src/components/animations/ButtonPressAnimation', () =>
  jest.fn(({ children }) => children)
);

jest.mock('../../src/components/Icon', () => ({
  Icon: jest.fn(() => null),
}));

const mockStart = jest.fn();

jest.mock('react-native/Libraries/Animated/src/Animated', () => ({
  createAnimatedComponent: jest.fn(() => jest.fn(({ children }) => children)),
  timing: jest.fn(),
  parallel: jest.fn(() => ({
    start: mockStart,
  })),
  Value: jest.fn(() => ({
    interpolate: jest.fn(),
  })),
  Image: jest.fn(() => null),
}));

jest.mock('react-native/Libraries/Components/Touchable/TouchableOpacity', () =>
  jest.fn(({ children }) => children)
);

const chance = new Chance();

describe('SystemNotification', () => {
  let props: SystemNotificationProps,
    closedText: string,
    openedBodyText: string,
    openedHeaderText: string;

  beforeEach(() => {
    closedText = chance.string();
    openedBodyText = chance.string();
    openedHeaderText = chance.string();

    props = {
      closedText,
      openedBodyText,
      openedHeaderText,
    };
  });

  it('should render only the children text if it is not open', () => {
    const { queryByText } = render(<SystemNotification {...props} />);

    expect(AnimatedText).toHaveBeenCalledWith(
      expect.objectContaining({
        children: closedText,
      }),
      {}
    );

    expect(queryByText(openedHeaderText)).toBeNull();
  });

  it('should render only the opened text if it is open', async () => {
    const { getByText, getByTestId, queryByText } = render(
      <SystemNotification {...props} />
    );

    const systemNotification = getByTestId('system-notification');

    await act(async () => {
      await fireEvent.press(systemNotification);
      mockStart.mock.calls[0][0]();
    });

    await waitFor(() => getByText(openedHeaderText));
    await waitFor(() => getByText(openedBodyText));

    await act(async () => {
      await fireEvent.press(systemNotification);
    });

    expect(queryByText(openedHeaderText)).toBeNull();
    expect(queryByText(openedBodyText)).toBeNull();
  });
});
