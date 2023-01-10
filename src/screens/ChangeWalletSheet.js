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

import { Container, Sheet, Text, Touchable } from '@cardstack/components';
import { removeFCMToken } from '@cardstack/models/firebase';
import { Routes, useLoadingOverlay } from '@cardstack/navigation';
import { getAddressPreview } from '@cardstack/utils';

import { Alert } from '@rainbow-me/components/alerts';
import {
  useAccountSettings,
  useWalletManager,
  useWallets,
} from '@rainbow-me/hooks';
import { resetWallet } from '@rainbow-me/model/wallet';
import { deviceUtils, showActionSheetWithOptions } from '@rainbow-me/utils';
import logger from 'logger';

import Divider from '../components/Divider';
import WalletList from '../components/change-wallet/WalletList';
import { removeWalletData } from '../handlers/localstorage/removeWallet';
import WalletLoadingStates from '../helpers/walletLoadingStates';
import { useWalletsWithBalancesAndNames } from '../hooks/useWalletsWithBalancesAndNames';
import {
  createAccountForWallet,
  walletsLoadState,
  walletsSetSelected,
  walletsUpdate,
} from '../redux/wallets';
import colors, { getRandomColor } from '../styles/colors';

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

  const { goBack, navigate } = useNavigation();
  const dispatch = useDispatch();
  const { accountAddress } = useAccountSettings();
  const { changeSelectedWallet, initializeWallet } = useWalletManager();
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
      const account = wallet.addresses.find(acc => acc.address === address);

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
                  newWallets[walletId].addresses.some((acc, index) => {
                    if (acc.address === address) {
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
              async innerButtonIndex => {
                if (innerButtonIndex === 0) {
                  showLoadingOverlay({
                    title: WalletLoadingStates.DELETING_WALLET,
                  });

                  const otherAccounts = Object.keys(wallets).reduce(
                    (acc, walletKey) => {
                      const currentAccount = wallets[walletKey].addresses.find(
                        account => account.address !== address
                      );
                      if (currentAccount) {
                        acc.push({ ...currentAccount, walletKey });
                      }
                      return acc;
                    },
                    []
                  );

                  await deleteWallet(walletId, address);

                  ReactNativeHapticFeedback.trigger('notificationSuccess');

                  const isLastAvailableWallet = !otherAccounts.length;

                  if (isLastAvailableWallet) {
                    await resetWallet();

                    dismissLoadingOverlay();

                    return;
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
      onChangeAccount,
      renameWallet,
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
                if (isDamaged) {
                  Alert({
                    message: `Your wallet might be damaged.\nTo add new account please reset your wallet and re-import it using your seed phrase.`,
                    title: 'An error ocurred',
                  });

                  creatingWallet.current = false;

                  return;
                }

                showLoadingOverlay({
                  title: WalletLoadingStates.CREATING_WALLET,
                });

                const name = get(args, 'name', '');
                const color = get(args, 'color', getRandomColor());

                try {
                  await dispatch(
                    createAccountForWallet(selectedWallet.id, color, name)
                  );

                  await initializeWallet();
                } catch (e) {
                  logger.sentry('Error while trying to add account');
                  captureException(e);
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
    dismissLoadingOverlay,
    dispatch,
    goBack,
    initializeWallet,
    isDamaged,
    navigate,
    selectedWallet.id,
    showLoadingOverlay,
  ]);

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
        scrollEnabled={scrollEnabled}
        showDividers={showDividers}
      />
    </Sheet>
  );
}
