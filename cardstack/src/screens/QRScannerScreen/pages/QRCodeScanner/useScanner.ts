import { isValidMerchantPaymentUrl } from '@cardstack/cardpay-sdk';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { useCallback } from 'react';
import { Linking } from 'react-native';

import { strings } from './strings';
import useWalletConnectConnections from '@cardstack/hooks/wallet-connect/useWalletConnectConnections';
import { WCRedirectTypes } from '@cardstack/screens/sheets/WalletConnectRedirectSheet';
import { convertDeepLinkToCardWalletProtocol, Device } from '@cardstack/utils';
import Routes from '@rainbow-me/routes';
import logger from 'logger';
import { Alert } from '@rainbow-me/components/alerts';
import useBooleanState from '@rainbow-me/hooks/useBooleanState';
import { getEthereumAddressFromQRCodeData } from '@rainbow-me/utils/address';
import haptics from '@rainbow-me/utils/haptics';

export interface useScannerParams {
  customScanAddressHandler?: (address: string) => void;
}

export const useScanner = ({ customScanAddressHandler }: useScannerParams) => {
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

      Alert({
        callback: enableScanning,
        message: strings.unrecognizedAlert.message,
        title: strings.unrecognizedAlert.title,
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

        const address = await getEthereumAddressFromQRCodeData(data);

        if (address) {
          return customScanAddressHandler?.(address)
            ? customScanAddressHandler(address)
            : handleScanAddress(address);
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
    isScanningEnabled,
  };
};
