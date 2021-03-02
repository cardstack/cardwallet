import Chance from 'chance';
import React from 'react';
import { SectionList } from 'react-native';

import { render } from '../test-utils';
import {
  ExpandedCard,
  ExpandedCardProps,
} from '../../src/components/PrepaidCard/ExpandedCard';
import { TransactionType } from '@cardstack/components';

jest.mock('../../../src/components/animations/ButtonPressAnimation', () =>
  jest.fn(({ children }) => children)
);

jest.mock('react-native/Libraries/Lists/SectionList', () => {
  return jest.fn(() => null);
});

const chance = new Chance();

describe('ExpandedCard', () => {
  let props: ExpandedCardProps;

  const createRandomTransactionDataItem = () => ({
    type: chance.pickone(Object.values(TransactionType)),
    recipient: chance.name(),
    transactionAmount: chance.natural(),
  });

  const createRandomActivityItem = () => ({
    title: chance.word(),
    data: chance.n(createRandomTransactionDataItem, chance.d6()),
  });

  beforeEach(() => {
    props = {
      recentActivity: chance.n(createRandomActivityItem, chance.d6()),
    };
  });

  it('should render the features text', () => {
    const { getByText } = render(<ExpandedCard {...props} />);

    getByText('Features');
  });

  it('should render a SectionList for Recent Activity', () => {
    const mockSectionList = SectionList as any;
    mockSectionList.mockReset();
    mockSectionList.mockReturnValue(null);
    const { getByText } = render(<ExpandedCard {...props} />);

    getByText('Recent Activity');
    expect(SectionList).toHaveBeenCalledTimes(1);
    expect(SectionList).toHaveBeenCalledWith(
      {
        keyExtractor: expect.any(Function),
        sections: props.recentActivity,
        renderItem: expect.any(Function),
        renderSectionHeader: expect.any(Function),
      },
      {}
    );
  });
});
