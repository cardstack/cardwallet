import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useAccountProfile, useRequests } from '../../hooks';
import { useNavigation } from '../../navigation/Navigation';
import { NumberBadge } from '../badge';
import { ContactAvatar } from '../contacts';
import ImageAvatar from '../contacts/ImageAvatar';
import { Centered } from '../layout';
import HeaderButton from './HeaderButton';
import Routes from '@rainbow-me/routes';

const walletSelector = createSelector(
  ({ wallets: { selected = {} }, settings: { accountAddress } }) => ({
    accountAddress,
    selectedWallet: selected,
  }),
  ({ accountAddress, selectedWallet }) => {
    const selectedAccount = selectedWallet?.addresses?.find(
      account => account.address === accountAddress
    );
    return {
      image: selectedAccount ? selectedAccount.image : '',
    };
  }
);

export default function ProfileHeaderButton() {
  const { navigate } = useNavigation();
  const { pendingRequestCount } = useRequests();
  const { accountSymbol, accountColor } = useAccountProfile();

  const { image } = useSelector(walletSelector);

  const onPress = useCallback(() => navigate(Routes.PROFILE_SCREEN), [
    navigate,
  ]);

  const onLongPress = useCallback(() => navigate(Routes.CHANGE_WALLET_SHEET), [
    navigate,
  ]);

  const { colors } = useTheme();

  return (
    <HeaderButton
      onLongPress={onLongPress}
      onPress={onPress}
      testID="navbar-profile-button"
      transformOrigin="left"
    >
      <Centered>
        {image ? (
          <ImageAvatar image={image} size="small" />
        ) : (
          <ContactAvatar
            color={isNaN(accountColor) ? colors.skeleton : accountColor}
            size="small"
            value={accountSymbol}
          />
        )}
        <NumberBadge
          isVisible={Number(pendingRequestCount) > 0}
          value={pendingRequestCount}
        />
      </Centered>
    </HeaderButton>
  );
}
