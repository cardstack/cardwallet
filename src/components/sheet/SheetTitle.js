import React from 'react';
import { Text } from '@cardstack/components';

const SheetTitle = props => {
  return (
    <Text fontSize={18} textAlign="center" weight="extraBold" {...props} />
  );
};

export default SheetTitle;
