import React from 'react';
import { Text } from '@cardstack/components';

const SheetTitle = props => {
  return (
    <Text fontSize={18} weight="extraBold" textAlign="center" {...props} />
  );
};

export default SheetTitle;
