import React, { useImperativeHandle, useState } from 'react';

import { Text } from '@cardstack/components';

const style = { marginBottom: -27 };

const PlaceholderText = (props, ref) => {
  const [value, updateValue] = useState(' ');
  useImperativeHandle(ref, () => ({ updateValue }));
  return (
    <Text
      color="grayText"
      fontSize={20}
      ref={ref}
      style={style}
      textAlign="center"
      weight="bold"
      width="100%"
    >
      {value}
    </Text>
  );
};

export default React.forwardRef(PlaceholderText);
