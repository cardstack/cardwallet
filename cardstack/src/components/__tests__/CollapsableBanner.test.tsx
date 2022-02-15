import React from 'react';

import { fireEvent, render, waitFor, act } from '../../test-utils';
import {
  CollapsibleBanner,
  CollapsibleBannerProps,
} from '@cardstack/components/CollapsibleBanner/CollapsibleBanner';

jest.mock('react-native/Libraries/Components/Touchable/TouchableOpacity', () =>
  jest.fn(({ children }) => children)
);

describe('CollapsibleBanner', () => {
  let props: CollapsibleBannerProps,
    closedText: string,
    openedBodyText: string,
    openedHeaderText: string,
    closeForeverButtonText: string;

  beforeEach(() => {
    closedText = 'Closed';
    openedBodyText = 'Opened Body';
    openedHeaderText = 'Opened Header';
    closeForeverButtonText = 'Close';

    props = {
      closedText,
      openedBodyText,
      openedHeaderText,
      closeForeverButtonText,
    };
  });

  it('should render only the children text if it is not open', () => {
    const { getByText, queryByText } = render(<CollapsibleBanner {...props} />);

    getByText(closedText);
    expect(queryByText(openedHeaderText)).toBeNull();
  });

  it('should render only the opened text if it is open', async () => {
    const { getByText, getByTestId, queryByText } = render(
      <CollapsibleBanner {...props} />
    );

    const collapsibleBanner = getByTestId('collapsible-banner');

    await act(async () => {
      await fireEvent.press(collapsibleBanner);
    });

    await waitFor(() => getByText(openedHeaderText));
    await waitFor(() => getByText(openedBodyText));

    await act(async () => {
      fireEvent.press(collapsibleBanner);
    });

    expect(queryByText(openedHeaderText)).toBeNull();
    expect(queryByText(openedBodyText)).toBeNull();
  });
});
