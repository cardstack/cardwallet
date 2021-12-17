import {
  CARDWALLET_SCHEME,
  isValidMerchantPaymentUrl,
} from '@cardstack/cardpay-sdk';
import lang from 'i18n-js';
import { useCallback, useEffect, useState } from 'react';
import {
  InteractionManager,
  Linking,
  Alert as NativeAlert,
} from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';
import Url from 'url-parse';
import { Alert } from '../components/alerts';
import { checkPushNotificationPermissions } from '../model/firebase';
import { useNavigation } from '../navigation/Navigation';
import usePrevious from './usePrevious';
import useWallets from './useWallets';
import useWalletConnectConnections from '@cardstack/hooks/wallet-connect/useWalletConnectConnections';
import { Device } from '@cardstack/utils';
import { enableActionsOnReadOnlyWallet } from '@rainbow-me/config/debug';
import Routes from '@rainbow-me/routes';
import { addressUtils, haptics } from '@rainbow-me/utils';
import logger from 'logger';

function useScannerState(enabled) {
  const [isCameraAuthorized, setIsCameraAuthorized] = useState(true);
  const [isScanningEnabled, setIsScanningEnabled] = useState(enabled);
  const wasEnabled = usePrevious(enabled);

  useEffect(() => {
    setIsScanningEnabled(enabled);
  }, [enabled]);

  const disableScanning = useCallback(() => {
    logger.log('📠🚫 Disabling QR Code Scanner');
    setIsScanningEnabled(false);
  }, []);

  const enableScanning = useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
      logger.log('📠✅ Enabling QR Code Scanner', enabled);
      setIsScanningEnabled(enabled);
    });
  }, [enabled]);

  useEffect(() => {
    if (enabled && !wasEnabled && ios) {
      request(PERMISSIONS.IOS.CAMERA).then(permission => {
        const result = permission === 'granted';
        if (isCameraAuthorized !== result) {
          setIsCameraAuthorized(result);
        }
      });

      if (!isScanningEnabled) {
        enableScanning();
      }
    }
  }, [
    enabled,
    enableScanning,
    isCameraAuthorized,
    isScanningEnabled,
    wasEnabled,
  ]);

  return {
    disableScanning,
    enableScanning,
    isCameraAuthorized,
    isScanningEnabled,
  };
}

// convert https:// to `${CARDWALLET_SCHEME}:/`
const convertDeepLinkToCardWalletProtocol = deepLink => {
  let url = new Url(deepLink);
  if (url.protocol === 'https:') {
    return `${CARDWALLET_SCHEME}:/${url.pathname}${url.query || ''}`;
  }
  return deepLink;
};

export default function useScanner(enabled) {
  const { navigate } = useNavigation();
  const { isReadOnlyWallet } = useWallets();
  const { walletConnectOnSessionRequest } = useWalletConnectConnections();

  const {
    disableScanning,
    enableScanning,
    isCameraAuthorized,
    isScanningEnabled,
  } = useScannerState(enabled);

  const handleScanAddress = useCallback(
    address => {
      if (isReadOnlyWallet && !enableActionsOnReadOnlyWallet) {
        NativeAlert.alert(`You need to import the account in order to do this`);
        return null;
      }

      haptics.notificationSuccess();

      // First navigate to wallet screen
      navigate(Routes.WALLET_SCREEN);

      // And then navigate to Send sheet
      if (Device.isAndroid) {
        navigate(Routes.SEND_FLOW, {
          params: { address },
          screen: Routes.SEND_SHEET,
        });
      } else {
        navigate(Routes.SEND_FLOW, { address });
      }

      setTimeout(enableScanning, 1000);
    },
    [enableScanning, isReadOnlyWallet, navigate]
  );

  const handleScanWalletConnect = useCallback(
    async qrCodeData => {
      haptics.notificationSuccess();
      await checkPushNotificationPermissions();

      try {
        await walletConnectOnSessionRequest(qrCodeData, () => {
          setTimeout(enableScanning, 2000);
        });
      } catch (e) {
        logger.log('walletConnectOnSessionRequest exception', e);
        setTimeout(enableScanning, 2000);
      }
    },
    [enableScanning, walletConnectOnSessionRequest]
  );

  const handleScanInvalid = useCallback(
    qrCodeData => {
      logger.error({ qrCodeData });
      haptics.notificationError();
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
      disableScanning();
      const deeplink = decodeURIComponent(data);

      const address = await addressUtils.getEthereumAddressFromQRCodeData(data);
      if (address) return handleScanAddress(address);
      if (deeplink.startsWith('wc:')) return handleScanWalletConnect(data);
      if (isValidMerchantPaymentUrl(deeplink)) {
        const updatedDeepLink = convertDeepLinkToCardWalletProtocol(deeplink);
        haptics.notificationSuccess();
        return Linking.openURL(updatedDeepLink);
      }
      return handleScanInvalid(data);
    },
    [
      isScanningEnabled,
      disableScanning,
      handleScanAddress,
      handleScanWalletConnect,
      handleScanInvalid,
    ]
  );

  return {
    isCameraAuthorized,
    onScan,
  };
}
