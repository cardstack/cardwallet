import React from 'react';

import BuyPrepaidCard from '../../src/screens/BuyPrepaidCard';
import { render } from '../test-utils';

describe('BuyPrepaidCard', () => {
  it('should render the header', () => {
    const { getByText } = render(<BuyPrepaidCard />);

    getByText('Buy a Prepaid Card via Apple Pay to get started');
  });
});
