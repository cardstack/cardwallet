import React from 'react';

import { Text } from '@cardstack/components';

import { useDimensions } from '../../hooks';

const NumpadValue = ({ value }) => {
  const { width } = useDimensions();

  return (
    <Text color="settingsTeal" fontSize={72} weight="extraBold" width={width}>
      {'$' + (value ? value : '0')}
    </Text>
  );
};

export default React.memo(NumpadValue);
