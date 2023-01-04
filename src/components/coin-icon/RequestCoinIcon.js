import React from 'react';
import RequestVendorLogoIcon from './RequestVendorLogoIcon';
import { colors } from '@cardstack/theme';

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
