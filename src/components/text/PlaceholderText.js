import React, { useImperativeHandle, useState } from 'react';
import { Text } from '@cardstack/components';

const PlaceholderText = (props, ref) => {
  const [value, updateValue] = useState(' ');
  useImperativeHandle(ref, () => ({ updateValue }));
  return (
    <Text
      color="grayText"
      fontSize={20}
      fontWeight="600"
      ref={ref}
      style={{ marginBottom: -27 }}
      textAlign="center"
      width="100%"
    >
      {value}
    </Text>
  );
};

export default React.forwardRef(PlaceholderText);
