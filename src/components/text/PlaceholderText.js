import React, { useImperativeHandle, useState } from 'react';
import styled from 'styled-components';
import { Text } from '@cardstack/components';

const Placeholder = styled(Text).attrs({
  color: 'grayText',
  fontSize: 20,
  fontWeight: '600',
  textAlign: 'center',
})`
  margin-bottom: -27;
  width: 100%;
`;

const PlaceholderText = (props, ref) => {
  const [value, updateValue] = useState(' ');
  useImperativeHandle(ref, () => ({ updateValue }));
  return <Placeholder ref={ref}>{value}</Placeholder>;
};

export default React.forwardRef(PlaceholderText);
