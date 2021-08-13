import React, { useMemo } from 'react';
import { abbreviations } from '../../utils';
import { Text } from '@cardstack/components';
import { getAddressPreview } from '@cardstack/utils';

export default function TruncatedAddress({
  address,
  firstSectionLength,
  truncationLength,
  ...props
}) {
  const text = useMemo(
    () =>
      address
        ? truncationLength || firstSectionLength
          ? abbreviations.formatAddressForDisplay(
              address,
              truncationLength,
              firstSectionLength
            )
          : getAddressPreview(address)
        : 'Error displaying address',
    [address, firstSectionLength, truncationLength]
  );

  return (
    <Text fontFamily="RobotoMono-Regular" {...props}>
      {text}
    </Text>
  );
}
