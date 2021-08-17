import React, { useMemo } from 'react';
import { Text, TextProps } from './Text';
import { getAddressPreview } from '@cardstack/utils';

type TruncatedAddressProps = {
  address: string;
} & TextProps;

export const TruncatedAddress = ({
  address,
  ...props
}: TruncatedAddressProps) => {
  const text = useMemo(
    () => (address ? getAddressPreview(address) : 'Error displaying address'),
    [address]
  );

  return (
    <Text fontFamily="RobotoMono-Regular" {...props}>
      {text}
    </Text>
  );
};
