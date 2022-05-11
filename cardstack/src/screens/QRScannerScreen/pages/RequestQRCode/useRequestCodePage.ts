import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { usePaymentLinks } from '@cardstack/hooks/merchant/usePaymentLinks';
import { Routes } from '@cardstack/navigation';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';

export const useRequestCodePage = () => {
  const { navigate } = useNavigation();

  const { primarySafe } = usePrimarySafe();

  const { address: safeAddress, merchantInfo } = primarySafe || {};

  const { handleShareLink, paymentRequestDeepLink } = usePaymentLinks({
    address: safeAddress || '',
    merchantInfo,
  });

  const onRequestAmountPress = useCallback(() => {
    if (primarySafe?.address) {
      navigate(Routes.MERCHANT_PAYMENT_REQUEST_SHEET, {
        address: primarySafe?.address,
        merchantInfo,
      });
    }
  }, [primarySafe, navigate, merchantInfo]);

  const onCreateProfilePress = useCallback(() => {
    navigate(Routes.PROFILE_SCREEN);
  }, [navigate]);

  return {
    handleShareLink,
    safeAddress,
    paymentRequestDeepLink,
    merchantInfo,
    onRequestAmountPress,
    onCreateProfilePress,
  };
};
