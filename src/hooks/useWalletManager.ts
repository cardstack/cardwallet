import { delay } from '@cardstack/cardpay-sdk';
import { useNavigation } from '@react-navigation/native';
import { captureException } from '@sentry/react-native';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  CreateImportParams,
  createOrImportWallet,
  loadSeedPhrase,
  migrateSecretsWithNewPin,
  RainbowWallet,
} from '../model/wallet';
import {
  resetAccountState,
  settingsLoadNetwork,
  settingsUpdateAccountAddress,
} from '../redux/settings';
import {
  walletsLoadState,
  walletsSetSelected,
  walletsUpdate,
} from '../redux/wallets';
import useAccountSettings from './useAccountSettings';
import useInitializeAccount from './useInitializeAccount';

import { storeRegisteredFCMToken } from '@cardstack/models/firebase';
import { getPin, getSeedPhrase } from '@cardstack/models/secure-storage';
import { Routes, useLoadingOverlay } from '@cardstack/navigation';
import { appStateUpdate } from '@cardstack/redux/appState';
import { useAuthSelectorAndActions } from '@cardstack/redux/authSlice';
import { PinFlow } from '@cardstack/screens/PinScreen/types';
import { PinScreenNavParams } from '@cardstack/screens/PinScreen/usePinScreen';

import { mapDispatchToActions } from '@cardstack/utils';
import { saveAccountEmptyState } from '@rainbow-me/handlers/localstorage/accountLocal';
import { isValidSeed } from '@rainbow-me/helpers/validators';
import walletLoadingStates from '@rainbow-me/helpers/walletLoadingStates';

import logger from 'logger';
interface WalletsState {
  selectedWallet: RainbowWallet;
  wallets: RainbowWallet[];
}

export default function useWalletManager() {
  const dispatch = useDispatch();

  const { loadAccountData, fetchAccountAssets } = useInitializeAccount();

  const { network } = useAccountSettings();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const { navigate } = useNavigation();

  const { setHasWallet } = useAuthSelectorAndActions();

  const createWalletPin = useCallback(
    (overwriteParams: Partial<PinScreenNavParams> = {}) => {
      navigate(Routes.PIN_SCREEN, {
        flow: PinFlow.create,
        variant: 'dark',
        canGoBack: true,
        dismissOnSuccess: false,
        ...overwriteParams,
      });
    },
    [navigate]
  );

  const loadAllSeedPhrases = useCallback(
    async (wallets: RainbowWallet[], forceOldSeed: boolean = true) => {
      const seeds = [];

      // Needs to be sequential
      for (const walletId of Object.keys(wallets)) {
        const seed =
          (await loadSeedPhrase(walletId, undefined, forceOldSeed)) || '';
        // keychain needs a delay in order to retrieve all values
        await delay(1000);
        seeds.push(seed);
      }

      return seeds;
    },
    []
  );

  const migrateWalletIfNeeded = useCallback(
    async ({ selectedWallet, wallets }: WalletsState) =>
      new Promise<void>(async resolve => {
        try {
          const hasPin = !!(await getPin());
          const seed = await getSeedPhrase(selectedWallet.id);

          const hasSeed = isValidSeed(seed);

          if (hasPin && hasSeed) {
            resolve();
            return;
          }
          // No seed, we retry the migration, bc something probably went wrong
          const seedPhrases = await loadAllSeedPhrases(wallets);

          navigate(Routes.SEED_PHRASE_BACKUP, {
            seedPhrases,
            onSuccess: async () => {
              createWalletPin({
                dismissOnSuccess: true,
                onSuccess: async (pin: string) => {
                  try {
                    showLoadingOverlay({
                      title: walletLoadingStates.MIGRATING_SECRETS,
                    });

                    await migrateSecretsWithNewPin(selectedWallet, pin);
                    // Makes only one wallet available
                    dispatch(
                      walletsUpdate({
                        [selectedWallet.id]: selectedWallet,
                      })
                    );
                    resolve();
                  } finally {
                    dismissLoadingOverlay();
                  }
                },
              });
            },
          });
        } catch (e) {
          logger.sentry('Error migrating wallet');
        }
      }),
    [
      createWalletPin,
      dismissLoadingOverlay,
      dispatch,
      navigate,
      showLoadingOverlay,
      loadAllSeedPhrases,
    ]
  );

  const initializeWallet = useCallback(async () => {
    try {
      logger.sentry('Start wallet init');

      await dispatch(resetAccountState());
      logger.sentry('resetAccountState ran ok');

      await dispatch(settingsLoadNetwork());

      logger.sentry('done loading network');

      const walletsState = ((await dispatch(
        walletsLoadState()
      )) as unknown) as WalletsState;

      await migrateWalletIfNeeded(walletsState);

      await loadAccountData();
      logger.sentry('loaded account data');

      await fetchAccountAssets();

      // The push token needs to be re-registered within each network.
      await storeRegisteredFCMToken();

      dispatch(appStateUpdate({ walletReady: true }));
    } catch (error) {
      logger.sentry('Error while initializing wallet', error);
      captureException(error);

      return null;
    } finally {
      dispatch(appStateUpdate({ walletReady: true }));
    }
  }, [dispatch, migrateWalletIfNeeded, loadAccountData, fetchAccountAssets]);

  const initWalletResetNavState = useCallback(async () => {
    await initializeWallet();

    setHasWallet();
  }, [initializeWallet, setHasWallet]);

  const createNewWallet = useCallback(
    async () =>
      createWalletPin({
        onSuccess: async (pin: string) => {
          try {
            showLoadingOverlay({
              title: walletLoadingStates.CREATING_WALLET,
            });

            const wallet = await createOrImportWallet({
              pin,
            });

            const walletAddress = wallet?.address;

            await saveAccountEmptyState(
              true,
              walletAddress?.toLowerCase(),
              network
            );

            initWalletResetNavState();
          } catch (e) {
            logger.sentry('Error creating new wallet', e);
          }
        },
      }),
    [createWalletPin, initWalletResetNavState, network, showLoadingOverlay]
  );

  const importWallet = useCallback(
    async (params: CreateImportParams) => {
      createWalletPin({
        onSuccess: async (pin?: string) => {
          try {
            showLoadingOverlay({ title: walletLoadingStates.IMPORTING_WALLET });

            const wallet = await createOrImportWallet({ ...params, pin });

            if (wallet) {
              initWalletResetNavState();
            } else {
              dismissLoadingOverlay();
            }
          } catch (e) {
            // in case of creation error, we should redirect the user to the import via seed phrase
            // if the user goes back in the stack, they are not presented with the PIN creation
            navigate(Routes.BACKUP_RESTORE_EXPLANATION);

            logger.sentry('Error while importing wallet', e);

            Alert.alert(
              'Something went wrong while importing. Please try again!'
            );
          }
        },
      });
    },
    [
      createWalletPin,
      dismissLoadingOverlay,
      initWalletResetNavState,
      navigate,
      showLoadingOverlay,
    ]
  );

  const changeSelectedWallet = useCallback(
    async (wallet, address) => {
      const promises = mapDispatchToActions(
        dispatch,
        [walletsSetSelected, settingsUpdateAccountAddress],
        [wallet, address]
      );

      await Promise.all(promises);

      await initializeWallet();
    },
    [dispatch, initializeWallet]
  );

  return {
    initializeWallet,
    createNewWallet,
    importWallet,
    changeSelectedWallet,
    initWalletResetNavState,
  };
}
