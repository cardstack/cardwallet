import React from 'react';

import { colors } from '@cardstack/theme';

import RequestVendorLogoIcon from './RequestVendorLogoIcon';

const RequestCoinIconSize = 48;

const RequestCoinIcon = ({
  dappName,
  imageUrl,
  size = RequestCoinIconSize,
}) => (
  <RequestVendorLogoIcon
    backgroundColor={colors.white}
    borderRadius={size}
    dappName={dappName}
    imageUrl={imageUrl}
  />
);

export default React.memo(RequestCoinIcon);
