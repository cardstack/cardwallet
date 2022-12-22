import { isValidMerchantPaymentUrl } from '@cardstack/cardpay-sdk';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useRef } from 'react';

import { useBooleanState } from '@cardstack/hooks';
import useWalletConnectConnections from '@cardstack/hooks/wallet-connect/useWalletConnectConnections';
import Navigation from '@cardstack/navigation/Navigation';
import { Routes } from '@cardstack/navigation/routes';
import { WCRedirectTypes } from '@cardstack/screens/sheets/WalletConnectRedirectSheet';

import { Alert } from '@rainbow-me/components/alerts';
import { useTimeout } from '@rainbow-me/hooks';
import { getEthereumAddressFromQRCodeData } from '@rainbow-me/utils/address';
import haptics from '@rainbow-me/utils/haptics';
import logger from 'logger';

import { strings } from './strings';

const WC_SCAN_TIMEOUT = 2000; // 2s
export interface useScannerParams {
  customScanAddressHandler?: (address: string) => void;
}

export const useScanner = ({
  customScanAddressHandler,
}: useScannerParams = {}) => {
  const { navigate } = useNavigation();
  const { walletConnectOnSessionRequest } = useWalletConnectConnections();
  const { startTimeout } = useTimeout();

  const isWcScanEnabled = useRef(true);

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

      navigate(Routes.SEND_FLOW_EOA, { address });
    },
    [navigate]
  );

  const walletConnectOnSessionRequestCallback = useCallback(
    (type: WCRedirectTypes) => {
      switch (type) {
        case WCRedirectTypes.qrcodeInvalid:
          navigate(Routes.WALLET_CONNECT_REDIRECT_SHEET, {
            type,
          });

          break;
        case WCRedirectTypes.connect:
          navigate(Routes.HOME_SCREEN);
          break;
      }

      // WC QrCode becames invalid once its used,
      // so this waits a bit b4 enabling the scan again
      startTimeout(() => {
        isWcScanEnabled.current = true;
      }, WC_SCAN_TIMEOUT);
    },

    [navigate, startTimeout]
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

    Navigation.linkTo(deeplink);
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
      if (!data || !isScanningEnabled || !isWcScanEnabled.current) return null;

      try {
        disableScanning();
        const deeplink = decodeURIComponent(data);

        const address = await getEthereumAddressFromQRCodeData(data);

        if (address) {
          return customScanAddressHandler
            ? customScanAddressHandler(address)
            : handleScanAddress(address);
        }

        if (deeplink.startsWith('wc:')) {
          isWcScanEnabled.current = false;

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
      customScanAddressHandler,
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
