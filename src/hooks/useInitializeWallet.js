import { captureException } from '@sentry/react-native';
import { isNil } from 'lodash';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import runMigrations from '../model/migrations';
import { walletInit } from '../model/wallet';
import {
  settingsLoadNetwork,
  settingsUpdateAccountAddress,
} from '../redux/settings';
import { walletsLoadState } from '../redux/wallets';
import useAccountSettings from './useAccountSettings';
import useHideSplashScreen from './useHideSplashScreen';
import useInitializeAccountData from './useInitializeAccountData';
import useLoadAccountData from './useLoadAccountData';
import useLoadCoingeckoCoins from './useLoadCoingeckoCoins';
import useLoadGlobalData from './useLoadGlobalData';
import useResetAccountState from './useResetAccountState';
import { checkPushPermissionAndRegisterToken } from '@cardstack/models/firebase';
import { appStateUpdate } from '@cardstack/redux/appState';
import { getCurrencyConversionsRates } from '@cardstack/services';
import { setCurrencyConversionRates } from '@rainbow-me/redux/currencyConversion';
import logger from 'logger';

export default function useInitializeWallet() {
  const dispatch = useDispatch();
  const resetAccountState = useResetAccountState();
  const loadAccountData = useLoadAccountData();
  const loadCoingeckoCoins = useLoadCoingeckoCoins();
  const loadGlobalData = useLoadGlobalData();
  const initializeAccountData = useInitializeAccountData();

  const { network } = useAccountSettings();
  const hideSplashScreen = useHideSplashScreen();

  const initializeWallet = useCallback(
    async ({
      seedPhrase = undefined,
      color = null,
      name = null,
      shouldRunMigrations = false,
      overwrite = false,
      checkedWallet = null,
    } = {}) => {
      try {
        logger.log('Start wallet setup');

        await resetAccountState();
        logger.log('resetAccountState ran ok');

        await dispatch(settingsLoadNetwork());

        // TODO: move to rtk query
        const conversionsRates = await getCurrencyConversionsRates();

        await dispatch(setCurrencyConversionRates(conversionsRates));

        logger.log('done loading network');

        const isImporting = !!seedPhrase;
        logger.log('isImporting?', isImporting);

        // TODO: move to fallbackExplorer, shouldn't be related with initializating a wallet
        await loadCoingeckoCoins();

        if (shouldRunMigrations && !isImporting) {
          logger.log('shouldRunMigrations && !seedPhrase? => true');
          await dispatch(walletsLoadState());
          logger.log('walletsLoadState call #1');
          await runMigrations();
          logger.log('done with migrations');
        }

        const { isNew, walletAddress } = await walletInit(
          seedPhrase,
          color,
          name,
          overwrite,
          checkedWallet,
          network
        );

        logger.log('walletInit returned ', {
          isNew,
          walletAddress,
        });

        if (isImporting || isNew) {
          logger.log('walletsLoadState call #2');
          await dispatch(walletsLoadState());
        }

        if (isNil(walletAddress)) {
          logger.log('walletAddress is nil');
          if (!isImporting) {
            dispatch(appStateUpdate({ walletReady: true }));
          }
          return null;
        }

        await dispatch(settingsUpdateAccountAddress(walletAddress));
        logger.log('updated settings address', walletAddress);

        // Newly created / imported accounts have no data in localstorage
        if (!(isNew || isImporting)) {
          await loadGlobalData();
          logger.log('loaded global data...');
          await loadAccountData(network);
          logger.log('loaded account data', network);
        }

        hideSplashScreen();
        logger.log('Hide splash screen');
        initializeAccountData();

        dispatch(appStateUpdate({ walletReady: true }));

        logger.log('💰 Wallet initialized');

        checkPushPermissionAndRegisterToken(walletAddress, seedPhrase);
        return walletAddress;
      } catch (error) {
        logger.sentry('Error while initializing wallet', error);
        // TODO specify error states more granular
        hideSplashScreen();
        captureException(error);
        Alert.alert('Something went wrong while importing. Please try again!');
        dispatch(appStateUpdate({ walletReady: true }));
        return null;
      }
    },
    [
      resetAccountState,
      loadCoingeckoCoins,
      network,
      dispatch,
      hideSplashScreen,
      initializeAccountData,
      loadGlobalData,
      loadAccountData,
    ]
  );

  return initializeWallet;
}
