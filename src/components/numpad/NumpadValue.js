import React from 'react';

import { useDimensions } from '../../hooks';
import { Text } from '@cardstack/components';

const NumpadValue = ({ value }) => {
  const { width } = useDimensions();

  return (
    <Text color="grayText" fontSize={60} fontWeight="700" width={width}>
      {'$' + (value ? value : '0')}
    </Text>
  );
};

export default React.memo(NumpadValue);
