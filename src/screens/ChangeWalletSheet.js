import { useApolloClient } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { captureException } from '@sentry/react-native';
import { get, toLower } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { InteractionManager } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useDispatch } from 'react-redux';

import Divider from '../components/Divider';
import WalletList from '../components/change-wallet/WalletList';
import { backupUserDataIntoCloud } from '../handlers/cloudBackup';
import { removeWalletData } from '../handlers/localstorage/removeWallet';
import showWalletErrorAlert from '../helpers/support';
import WalletLoadingStates from '../helpers/walletLoadingStates';
import WalletTypes from '../helpers/walletTypes';
import { useWalletsWithBalancesAndNames } from '../hooks/useWalletsWithBalancesAndNames';
import { cleanUpWalletKeys } from '../model/wallet';
import {
  createAccountForWallet,
  walletsLoadState,
  walletsSetSelected,
  walletsUpdate,
} from '../redux/wallets';
import { getRandomColor } from '../styles/colors';
import { Container, Sheet, Text, Touchable } from '@cardstack/components';
import { removeFCMToken } from '@cardstack/models/firebase';
import {
  navigationStateInit,
  Routes,
  useLoadingOverlay,
} from '@cardstack/navigation';
import { getAddressPreview } from '@cardstack/utils';
import WalletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
import {
  useAccountSettings,
  useWalletManager,
  useWallets,
} from '@rainbow-me/hooks';

import { deviceUtils, showActionSheetWithOptions } from '@rainbow-me/utils';
import logger from 'logger';

const getWalletRowCount = wallets => {
  let count = 0;
  if (wallets) {
    Object.keys(wallets).forEach(key => {
      // Addresses
      count += wallets[key].addresses.length;
    });
  }
  return count;
};

export default function ChangeWalletSheet() {
  const { isDamaged, selectedWallet, wallets } = useWallets();
  const [editMode, setEditMode] = useState(false);
  const { colors } = useTheme();

  const { goBack, navigate, reset } = useNavigation();
  const dispatch = useDispatch();
  const { accountAddress } = useAccountSettings();
  const {
    changeSelectedWallet,
    createNewWallet,
    initializeWallet,
  } = useWalletManager();
  const walletsWithBalancesAndNames = useWalletsWithBalancesAndNames();
  const creatingWallet = useRef();

  const [currentAddress, setCurrentAddress] = useState(accountAddress);
  const [currentSelectedWallet, setCurrentSelectedWallet] = useState(
    selectedWallet
  );

  const apolloClient = useApolloClient();

  const walletRowCount = useMemo(() => getWalletRowCount(wallets), [wallets]);

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const deviceHeight = deviceUtils.dimensions.height;
  const footerHeight = 160;
  const listPaddingBottom = 6;
  const walletRowHeight = 60;
  const maxListHeight = deviceHeight - 220;
  let headerHeight = 30;
  let listHeight =
    walletRowHeight * walletRowCount + footerHeight + listPaddingBottom;
  let scrollEnabled = false;
  let showDividers = false;
  if (listHeight > maxListHeight) {
    headerHeight = 40;
    listHeight = maxListHeight;
    scrollEnabled = true;
    showDividers = true;
  }
  useEffect(() => {
    setCurrentAddress(accountAddress);
  }, [accountAddress]);

  const onChangeAccount = useCallback(
    async (walletId, address, fromDeletion = false) => {
      if (editMode && !fromDeletion) return;
      if (address === currentAddress) return;
      try {
        showLoadingOverlay({ title: WalletLoadingStates.SWITCHING_ACCOUNT });
        // Nuke apollo data to refetch after changing account
        await apolloClient.clearStore();
        const wallet = wallets[walletId];
        await changeSelectedWallet(wallet, address);
        !fromDeletion && goBack();
      } catch (e) {
        logger.log('error while switching account', e);
      } finally {
        dismissLoadingOverlay();
      }
    },
    [
      apolloClient,
      changeSelectedWallet,
      currentAddress,
      dismissLoadingOverlay,
      editMode,
      goBack,
      showLoadingOverlay,
      wallets,
    ]
  );

  const deleteWallet = useCallback(
    async (walletId, address) => {
      try {
        const allWallets = {
          ...wallets,
          [walletId]: {
            ...wallets[walletId],
            addresses: wallets[walletId].addresses.filter(
              account => toLower(account.address) !== toLower(address)
            ),
          },
        };

        const { [walletId]: currentWallet, ...otherWallets } = allWallets;

        // If there are no accounts left on wallet
        // remove the wallet
        const isCurrentWalletEmpty = !currentWallet.addresses.length;

        const updatedWallets = isCurrentWalletEmpty ? otherWallets : allWallets;

        // unregister in hub and remove fcm for this account from asyncStorage
        await removeFCMToken(address);
        await removeWalletData(address);

        await dispatch(walletsUpdate(updatedWallets));
      } catch (e) {
        logger.sentry('Error deleting account', e);
      }
    },
    [dispatch, wallets]
  );

  const renameWallet = useCallback(
    (walletId, address) => {
      const wallet = wallets[walletId];
      const account = wallet.addresses.find(
        account => account.address === address
      );

      InteractionManager.runAfterInteractions(() => {
        goBack();
      });

      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          navigate(Routes.MODAL_SCREEN, {
            address,
            asset: [],
            onCloseModal: async args => {
              if (args) {
                const newWallets = { ...wallets };
                if ('name' in args) {
                  newWallets[walletId].addresses.some((account, index) => {
                    if (account.address === address) {
                      newWallets[walletId].addresses[index].label = args.name;
                      newWallets[walletId].addresses[index].color = args.color;
                      if (currentSelectedWallet.id === walletId) {
                        setCurrentSelectedWallet(wallet);
                        dispatch(walletsSetSelected(newWallets[walletId]));
                      }
                      return true;
                    }
                    return false;
                  });
                  await dispatch(walletsUpdate(newWallets));
                }
                await dispatch(walletsLoadState());
              }
            },
            profile: {
              color: account.color,
              name: account.label || ``,
            },
            type: 'wallet_profile',
          });
        }, 50);
      });
    },
    [dispatch, goBack, navigate, currentSelectedWallet.id, wallets]
  );

  const onEditWallet = useCallback(
    (walletId, address, label) => {
      const buttons = ['Edit Account', 'Delete Account', 'Cancel'];

      showActionSheetWithOptions(
        {
          cancelButtonIndex: 2,
          destructiveButtonIndex: 1,
          options: buttons,
          title: `${label || getAddressPreview(address)}`,
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            // Edit wallet
            renameWallet(walletId, address);
          } else if (buttonIndex === 1) {
            // Delete wallet with confirmation
            showActionSheetWithOptions(
              {
                cancelButtonIndex: 1,
                destructiveButtonIndex: 0,
                message: `Are you sure you want to delete this account?`,
                options: ['Delete Account', 'Cancel'],
              },
              async buttonIndex => {
                if (buttonIndex === 0) {
                  showLoadingOverlay({
                    title: WalletLoadingStates.DELETING_WALLET,
                  });

                  const otherAccounts = Object.keys(wallets).reduce(
                    (acc, walletKey) => {
                      const account = wallets[walletKey].addresses.find(
                        account => account.address !== address
                      );
                      if (account) {
                        acc.push({ ...account, walletKey });
                      }
                      return acc;
                    },
                    []
                  );

                  await deleteWallet(walletId, address);

                  ReactNativeHapticFeedback.trigger('notificationSuccess');

                  const isLastAvailableWallet = !otherAccounts.length;

                  if (isLastAvailableWallet) {
                    await cleanUpWalletKeys();

                    dismissLoadingOverlay();

                    // Dismiss change wallet
                    goBack();

                    reset(navigationStateInit);
                  } else {
                    // If we're deleting the selected wallet
                    // we need to switch to another one
                    if (address === currentAddress) {
                      const eligibleAccount = otherAccounts[0];

                      if (eligibleAccount) {
                        await onChangeAccount(
                          eligibleAccount.walletKey,
                          eligibleAccount.address,
                          true
                        );
                      }
                    }
                  }
                  dismissLoadingOverlay();
                  setEditMode(false);
                }
              }
            );
          }
        }
      );
    },
    [
      currentAddress,
      deleteWallet,
      dismissLoadingOverlay,
      goBack,
      onChangeAccount,
      renameWallet,
      reset,
      showLoadingOverlay,
      wallets,
    ]
  );

  const onPressAddAccount = useCallback(async () => {
    try {
      if (creatingWallet.current) return;
      creatingWallet.current = true;

      // Show naming modal
      InteractionManager.runAfterInteractions(() => {
        goBack();
      });
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          navigate(Routes.MODAL_SCREEN, {
            actionType: 'Create',
            asset: [],
            isNewProfile: true,
            onCloseModal: async args => {
              if (args) {
                showLoadingOverlay({
                  title: WalletLoadingStates.CREATING_WALLET,
                });

                const name = get(args, 'name', '');
                const color = get(args, 'color', getRandomColor());
                // Check if the selected wallet is the primary
                let primaryWalletKey = selectedWallet.primary
                  ? selectedWallet.id
                  : null;

                // If it's not, then find it
                !primaryWalletKey &&
                  Object.keys(wallets).some(key => {
                    const wallet = wallets[key];
                    if (
                      wallet.type === WalletTypes.mnemonic &&
                      wallet.primary
                    ) {
                      primaryWalletKey = key;
                      return true;
                    }
                    return false;
                  });

                // If there's no primary wallet at all,
                // we fallback to an imported one with a seed phrase
                !primaryWalletKey &&
                  Object.keys(wallets).some(key => {
                    const wallet = wallets[key];
                    if (
                      wallet.type === WalletTypes.mnemonic &&
                      wallet.imported
                    ) {
                      primaryWalletKey = key;
                      return true;
                    }
                    return false;
                  });

                try {
                  // If we found it and it's not damaged use it to create the new account
                  if (primaryWalletKey && !wallets[primaryWalletKey].damaged) {
                    const newWallets = await dispatch(
                      createAccountForWallet(primaryWalletKey, color, name)
                    );
                    await initializeWallet();
                    // If this wallet was previously backed up to the cloud
                    // We need to update userData backup so it can be restored too
                    if (
                      wallets[primaryWalletKey].backedUp &&
                      wallets[primaryWalletKey].backupType ===
                        WalletBackupTypes.cloud
                    ) {
                      try {
                        await backupUserDataIntoCloud({ wallets: newWallets });
                      } catch (e) {
                        logger.sentry(
                          'Updating wallet userdata failed after new account creation'
                        );
                        captureException(e);
                        throw e;
                      }
                    }

                    // If doesn't exist, we need to create a new wallet
                  } else {
                    await createNewWallet({ color, name });
                  }
                } catch (e) {
                  logger.sentry('Error while trying to add account');
                  captureException(e);
                  if (isDamaged) {
                    setTimeout(() => {
                      showWalletErrorAlert();
                    }, 1000);
                  }
                }
              }
              creatingWallet.current = false;

              dismissLoadingOverlay();
            },
            profile: {
              color: null,
              name: ``,
            },
            type: 'wallet_profile',
          });
        }, 50);
      });
    } catch (e) {
      dismissLoadingOverlay();
      logger.log('Error while trying to add account', e);
    }
  }, [
    createNewWallet,
    dismissLoadingOverlay,
    dispatch,
    goBack,
    initializeWallet,
    isDamaged,
    navigate,
    selectedWallet.id,
    selectedWallet.primary,
    showLoadingOverlay,
    wallets,
  ]);

  const onPressImportSeedPhrase = useCallback(() => {
    navigate(Routes.IMPORT_SEED_SHEET);
  }, [navigate]);

  return (
    <Sheet>
      <Container height={headerHeight}>
        <Text fontSize={18} textAlign="center" weight="extraBold">
          Accounts
        </Text>
        <Touchable
          onPress={() => setEditMode(e => !e)}
          position="absolute"
          right={20}
          top={4}
        >
          <Text color="tealDark" weight="bold">
            {editMode ? 'Done' : 'Edit'}
          </Text>
        </Touchable>
        {showDividers && (
          <Divider color={colors.rowDividerExtraLight} inset={[0, 15]} />
        )}
      </Container>

      <WalletList
        accountAddress={currentAddress}
        allWallets={walletsWithBalancesAndNames}
        currentWallet={currentSelectedWallet}
        editMode={editMode}
        height={listHeight}
        onChangeAccount={onChangeAccount}
        onEditWallet={onEditWallet}
        onPressAddAccount={onPressAddAccount}
        onPressImportSeedPhrase={onPressImportSeedPhrase}
        scrollEnabled={scrollEnabled}
        showDividers={showDividers}
      />
    </Sheet>
  );
}
