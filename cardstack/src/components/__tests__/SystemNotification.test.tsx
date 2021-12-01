import Chance from 'chance';
import React from 'react';

import { fireEvent, render, waitFor, act } from '../../test-utils';
import {
  SystemNotification,
  SystemNotificationProps,
} from '@cardstack/components';

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
    const { getByText, queryByText } = render(
      <SystemNotification {...props} />
    );

    getByText(closedText);
    expect(queryByText(openedHeaderText)).toBeNull();
  });

  it('should render only the opened text if it is open', async () => {
    const { getByText, getByTestId, queryByText } = render(
      <SystemNotification {...props} />
    );

    const systemNotification = getByTestId('system-notification');

    await act(async () => {
      await fireEvent.press(systemNotification);
      // mockStart.mock.calls[0][0]();
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
