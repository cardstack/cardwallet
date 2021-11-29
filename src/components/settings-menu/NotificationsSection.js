import React, { useCallback } from 'react';
import { RadioList, RadioListItem } from '../radio-list';

const listItems = [{ label: 'New Payments Received', value: false }];

const CurrencyListItem = ({ currency, label, ...item }) => (
  <RadioListItem {...item} label={`${label}`} value={currency} />
);

const NotificationsSection = () => {
  const onSelectCurrency = useCallback(console.log('Pressed'));

  return (
    <RadioList
      items={listItems}
      marginTop={7}
      onChange={onSelectCurrency}
      renderItem={CurrencyListItem}
      value
    />
  );
};

export default NotificationsSection;
