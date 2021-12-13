import React from 'react';

import { fireEvent, render, waitFor, act } from '../../test-utils';
import {
  SystemNotification,
  SystemNotificationProps,
} from '@cardstack/components/SystemNotification/SystemNotification';

jest.mock('react-native/Libraries/Components/Touchable/TouchableOpacity', () =>
  jest.fn(({ children }) => children)
);

describe('SystemNotification', () => {
  let props: SystemNotificationProps,
    closedText: string,
    openedBodyText: string,
    openedHeaderText: string;

  beforeEach(() => {
    closedText = 'Closed';
    openedBodyText = 'Opened Body';
    openedHeaderText = 'Opened Header';

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
    });

    await waitFor(() => getByText(openedHeaderText));
    await waitFor(() => getByText(openedBodyText));

    await act(async () => {
      fireEvent.press(systemNotification);
    });

    expect(queryByText(openedHeaderText)).toBeNull();
    expect(queryByText(openedBodyText)).toBeNull();
  });
});
