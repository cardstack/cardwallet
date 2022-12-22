import React, { useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import RequestVendorLogoIcon from './RequestVendorLogoIcon';

const RequestCoinIconSize = 48;

const RequestCoinIcon = ({
  dappName,
  imageUrl,
  size = RequestCoinIconSize,
}) => {
  const { colors } = useTheme();

  return (
    <RequestVendorLogoIcon
      backgroundColor={colors.white}
      borderRadius={size}
      dappName={dappName}
      imageUrl={imageUrl}
    />
  );
};

export default React.memo(RequestCoinIcon);
