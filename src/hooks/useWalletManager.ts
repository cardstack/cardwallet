import { useNavigation } from '@react-navigation/native';
import { captureException } from '@sentry/react-native';
import { isNil } from 'lodash';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  CreateImportParams,
  createOrImportWallet,
  loadAddress,
} from '../model/wallet';
import {
  resetAccountState,
  settingsLoadNetwork,
  settingsUpdateAccountAddress,
} from '../redux/settings';
import {
  addressSetSelected,
  walletsLoadState,
  walletsSetSelected,
} from '../redux/wallets';
import useAccountSettings from './useAccountSettings';
import useInitializeAccountData from './useInitializeAccountData';
import useLoadAccountData from './useLoadAccountData';
import useLoadGlobalData from './useLoadGlobalData';
import { checkPushPermissionAndRegisterToken } from '@cardstack/models/firebase';
import { Routes, useLoadingOverlay } from '@cardstack/navigation';
import { appStateUpdate } from '@cardstack/redux/appState';

import { PinFlow } from '@cardstack/screens/PinScreen/types';
import { saveAccountEmptyState } from '@rainbow-me/handlers/localstorage/accountLocal';
import logger from 'logger';

interface initializeWalleOptions {
  skipDismissOverlay?: boolean;
}

interface CreateWalletParams
  extends Pick<CreateImportParams, 'color' | 'name'> {
  onSuccess?: () => void;
}

export default function useWalletManager() {
  const dispatch = useDispatch();

  const loadAccountData = useLoadAccountData();
  const loadGlobalData = useLoadGlobalData();
  const initializeAccountData = useInitializeAccountData();

  const { network } = useAccountSettings();
  const { dismissLoadingOverlay } = useLoadingOverlay();

  const { navigate } = useNavigation();

  const initializeWallet = useCallback(
    async (seedPhrase?: string, options?: initializeWalleOptions) => {
      try {
        logger.sentry('Start wallet init');

        await dispatch(resetAccountState());
        logger.sentry('resetAccountState ran ok');

        await dispatch(settingsLoadNetwork());

        logger.sentry('done loading network');

        await dispatch(walletsLoadState());

        const walletAddress = await loadAddress();

        if (isNil(walletAddress)) {
          logger.sentry('[initializeWallet] - walletAddress null');
          dispatch(appStateUpdate({ walletReady: true }));
          return null;
        }
        await dispatch(settingsUpdateAccountAddress(walletAddress));

        await loadGlobalData();
        logger.sentry('loaded global data...');
        await loadAccountData(network);
        logger.sentry('loaded account data', network);

        await initializeAccountData();

        await checkPushPermissionAndRegisterToken(walletAddress, seedPhrase);

        dispatch(appStateUpdate({ walletReady: true }));

        return walletAddress;
      } catch (error) {
        logger.sentry('Error while initializing wallet', error);
        captureException(error);

        return null;
      } finally {
        if (!options?.skipDismissOverlay) dismissLoadingOverlay();
        dispatch(appStateUpdate({ walletReady: true }));
      }
    },
    [
      dispatch,
      network,
      initializeAccountData,
      loadGlobalData,
      loadAccountData,
      dismissLoadingOverlay,
    ]
  );

  const createWalletPin = useCallback(
    onSuccess => {
      navigate(Routes.PIN_SCREEN, {
        flow: PinFlow.create,
        variant: 'dark',
        canGoBack: true,
        dismissOnSuccess: false,
        onSuccess,
      });
    },
    [navigate]
  );

  const createNewWallet = useCallback(
    async ({ color, name, onSuccess }: CreateWalletParams = {}) =>
      createWalletPin(async (pin: string) => {
        try {
          const wallet = await createOrImportWallet({
            color,
            name,
            pin,
          });

          const walletAddress = wallet?.address;

          await saveAccountEmptyState(
            true,
            walletAddress?.toLowerCase(),
            network
          );

          onSuccess?.();
          initializeWallet();
        } catch (e) {
          logger.sentry('Error creating new wallet', e);
        }
      }),
    [createWalletPin, initializeWallet, network]
  );

  const importWallet = useCallback(
    async (params: CreateImportParams) => {
      try {
        const wallet = await createOrImportWallet(params);

        await initializeWallet(params.seed, { skipDismissOverlay: true });

        return wallet;
      } catch (e) {
        logger.sentry('Error while importing wallet', e);

        Alert.alert('Something went wrong while importing. Please try again!');
      }
    },
    [initializeWallet]
  );

  const changeSelectedWallet = useCallback(
    async (wallet, address) => {
      const p1 = dispatch(walletsSetSelected(wallet));
      const p2 = dispatch(addressSetSelected(address));
      await Promise.all([p1, p2]);

      await initializeWallet();
    },
    [dispatch, initializeWallet]
  );

  return {
    initializeWallet,
    createNewWallet,
    importWallet,
    changeSelectedWallet,
  };
}
