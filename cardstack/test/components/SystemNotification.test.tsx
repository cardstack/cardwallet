import Chance from 'chance';
import React from 'react';

import { act } from 'react-test-renderer';
import { fireEvent, render } from '../test-utils';
import {
  SystemNotification,
  Text,
  SystemNotificationProps,
} from '@cardstack/components';

jest.mock('../../../src/components/animations/ButtonPressAnimation', () =>
  jest.fn(({ children }) => children)
);

const chance = new Chance();

describe('SystemNotification', () => {
  let props: SystemNotificationProps,
    childrenText: string,
    openedComponentText: string;

  beforeEach(() => {
    childrenText = chance.string();
    openedComponentText = chance.string();

    props = {
      children: <Text>{childrenText}</Text>,
      openedComponent: <Text>{openedComponentText}</Text>,
    };
  });

  it('should render only the children text if it is not open', () => {
    const { getByText, queryByText } = render(
      <SystemNotification {...props} />
    );

    getByText(childrenText);
    expect(queryByText(openedComponentText)).toBeNull();
  });

  it('should render only the opened text if it is open', () => {
    const { getByText, queryByText, getByTestId } = render(
      <SystemNotification {...props} />
    );

    const systemNotification = getByTestId('system-notification');

    act(() => {
      fireEvent.press(systemNotification);
    });

    getByText(openedComponentText);
    expect(queryByText(childrenText)).toBeNull();
  });
});
