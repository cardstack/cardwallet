import { isValidMerchantPaymentUrl } from '@cardstack/cardpay-sdk';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import lang from 'i18n-js';
import { useCallback } from 'react';
import { Linking } from 'react-native';

import useWalletConnectConnections from '@cardstack/hooks/wallet-connect/useWalletConnectConnections';
import { WCRedirectTypes } from '@cardstack/screens/sheets/WalletConnectRedirectSheet';
import { convertDeepLinkToCardWalletProtocol, Device } from '@cardstack/utils';
import Routes from '@rainbow-me/routes';
import { addressUtils, haptics } from '@rainbow-me/utils';
import logger from 'logger';
import { useBooleanState } from '@rainbow-me/hooks';
import { Alert } from '@rainbow-me/components/alerts';

export const useScanner = () => {
  const { navigate } = useNavigation();
  const { walletConnectOnSessionRequest } = useWalletConnectConnections();

  const [
    isScanningEnabled,
    enableScanning,
    disableScanning,
  ] = useBooleanState();

  useFocusEffect(
    useCallback(() => {
      enableScanning();

      return disableScanning;
    }, [disableScanning, enableScanning])
  );

  const handleScanAddress = useCallback(
    address => {
      haptics.notificationSuccess();

      if (Device.isAndroid) {
        navigate(Routes.SEND_FLOW, {
          params: { address },
          screen: Routes.SEND_SHEET,
        });
      } else {
        navigate(Routes.SEND_FLOW, { address });
      }
    },
    [navigate]
  );

  const walletConnectOnSessionRequestCallback = useCallback(
    (type: WCRedirectTypes) => {
      if (type === WCRedirectTypes.qrcodeInvalid) {
        navigate(Routes.WALLET_CONNECT_REDIRECT_SHEET, {
          type,
        });
      }
    },
    [navigate]
  );

  const handleScanWalletConnect = useCallback(
    async qrCodeData => {
      haptics.notificationSuccess();

      try {
        walletConnectOnSessionRequest(
          qrCodeData,
          walletConnectOnSessionRequestCallback
        );
      } catch (e) {
        logger.log('walletConnectOnSessionRequest exception', e);
      }
    },
    [walletConnectOnSessionRequest, walletConnectOnSessionRequestCallback]
  );

  const handleScanPayMerchant = useCallback(deeplink => {
    haptics.notificationSuccess();

    const updatedDeepLink = convertDeepLinkToCardWalletProtocol(deeplink);

    Linking.openURL(updatedDeepLink);
  }, []);

  const handleScanInvalid = useCallback(
    qrCodeData => {
      haptics.notificationError();
      logger.error({ qrCodeData });

      return Alert({
        callback: enableScanning,
        message: lang.t('wallet.unrecognized_qrcode'),
        title: lang.t('wallet.unrecognized_qrcode_title'),
      });
    },
    [enableScanning]
  );

  const onScan = useCallback(
    async ({ data }) => {
      if (!data || !isScanningEnabled) return null;

      try {
        disableScanning();
        const deeplink = decodeURIComponent(data);

        const address = await addressUtils.getEthereumAddressFromQRCodeData(
          data
        );

        if (address) {
          return handleScanAddress(address);
        }

        if (deeplink.startsWith('wc:')) {
          return handleScanWalletConnect(data);
        }

        if (isValidMerchantPaymentUrl(deeplink)) {
          return handleScanPayMerchant(deeplink);
        }

        return handleScanInvalid(data);
      } finally {
        !isScanningEnabled && enableScanning();
      }
    },
    [
      isScanningEnabled,
      disableScanning,
      handleScanInvalid,
      handleScanAddress,
      handleScanWalletConnect,
      handleScanPayMerchant,
      enableScanning,
    ]
  );

  return {
    onScan,
    isLoading: !isScanningEnabled,
  };
};
