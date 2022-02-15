import React from 'react';

import { fireEvent, render, waitFor, act } from '../../test-utils';
import {
  CollapsableBanner,
  CollapsableBannerProps,
} from '@cardstack/components/CollapsableBanner/CollapsableBanner';

jest.mock('react-native/Libraries/Components/Touchable/TouchableOpacity', () =>
  jest.fn(({ children }) => children)
);

describe('CollapsableBanner', () => {
  let props: CollapsableBannerProps,
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
    const { getByText, queryByText } = render(<CollapsableBanner {...props} />);

    getByText(closedText);
    expect(queryByText(openedHeaderText)).toBeNull();
  });

  it('should render only the opened text if it is open', async () => {
    const { getByText, getByTestId, queryByText } = render(
      <CollapsableBanner {...props} />
    );

    const collapsableBanner = getByTestId('collapsable-banner');

    await act(async () => {
      await fireEvent.press(collapsableBanner);
    });

    await waitFor(() => getByText(openedHeaderText));
    await waitFor(() => getByText(openedBodyText));

    await act(async () => {
      fireEvent.press(collapsableBanner);
    });

    expect(queryByText(openedHeaderText)).toBeNull();
    expect(queryByText(openedBodyText)).toBeNull();
  });
});
