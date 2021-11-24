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
        logger.sentry('Start wallet setup');

        await resetAccountState();
        logger.sentry('resetAccountState ran ok');

        await dispatch(settingsLoadNetwork());

        // TODO: move to rtk query
        const conversionsRates = await getCurrencyConversionsRates();

        await dispatch(setCurrencyConversionRates(conversionsRates));

        logger.sentry('done loading network');

        const isImporting = !!seedPhrase;
        logger.sentry('isImporting?', isImporting);

        // TODO: move to fallbackExplorer, shouldn't be related with initializating a wallet
        await loadCoingeckoCoins();

        if (shouldRunMigrations && !isImporting) {
          logger.sentry('shouldRunMigrations && !seedPhrase? => true');
          await dispatch(walletsLoadState());
          logger.sentry('walletsLoadState call #1');
          await runMigrations();
          logger.sentry('done with migrations');
        }

        const { isNew, walletAddress } = await walletInit(
          seedPhrase,
          color,
          name,
          overwrite,
          checkedWallet,
          network
        );

        logger.sentry('walletInit returned ', {
          isNew,
          walletAddress,
        });

        if (isImporting || isNew) {
          logger.sentry('walletsLoadState call #2');
          await dispatch(walletsLoadState());
        }

        if (isNil(walletAddress)) {
          logger.sentry('walletAddress is nil');
          if (!isImporting) {
            dispatch(appStateUpdate({ walletReady: true }));
          }
          return null;
        }

        await dispatch(settingsUpdateAccountAddress(walletAddress));
        logger.sentry('updated settings address', walletAddress);

        // Newly created / imported accounts have no data in localstorage
        if (!(isNew || isImporting)) {
          await loadGlobalData();
          logger.sentry('loaded global data...');
          await loadAccountData(network);
          logger.sentry('loaded account data', network);
        }

        hideSplashScreen();
        logger.sentry('Hide splash screen');
        initializeAccountData();
        if (!isImporting) {
          dispatch(appStateUpdate({ walletReady: true }));
        }

        logger.sentry('💰 Wallet initialized');
        return walletAddress;
      } catch (error) {
        logger.sentry('Error while initializing wallet');
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
