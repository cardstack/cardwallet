import { text, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { PrepaidCard } from './PrepaidCard';

storiesOf('Prepaid Card', module).add('Default', () => {
  return (
    <PrepaidCard
      address={text('Identifier', '0xbeA3123457eF8')}
      issuer={text('Issuer', 'Cardstack')}
      issuingToken=""
      spendFaceValue={number('Spendable Balance (xDai)', 2500)}
      tokens={
        [
          {
            native: {
              balance: {
                display: text('USD Balance', '$25'),
              },
            },
          },
        ] as any
      }
      type="prepaid-card"
      networkName="xDai Chain"
      nativeCurrency="USD"
      currencyConversionRates={{}}
      transferrable={false}
      cardCustomization={{
        issuerName: 'PrepaidCardTest1',
        background: '#FFD800',
        patternColor: 'white',
        patternUrl:
          'https://app.cardstack.com/images/prepaid-card-customizations/pattern-2.svg',
        textColor: 'black',
      }}
    />
  );
});
