import React, { useCallback } from 'react';
import { Alert, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { useTheme } from '../../../context/ThemeContext';
import { deleteAllBackups } from '../../../handlers/cloudBackup';
import { walletsUpdate } from '../../../redux/wallets';
import { cloudPlatform } from '../../../utils/platform';
import Divider from '../../Divider';
import { ButtonPressAnimation } from '../../animations';
import { ContactAvatar } from '../../contacts';
import { Centered, Column, ColumnWithMargins, Row } from '../../layout';
import { TruncatedAddress } from '../../text';
import { Icon, Text } from '@cardstack/components';
import { getAddressPreview } from '@cardstack/utils';
import WalletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
import WalletTypes from '@rainbow-me/helpers/walletTypes';
import { useWallets } from '@rainbow-me/hooks';

import { useNavigation } from '@rainbow-me/navigation';
import { padding } from '@rainbow-me/styles';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

const Footer = styled(Centered)`
  flex: 1;
  align-items: flex-end;
  ${padding(19, 15, 30)};
`;

const WalletSelectionView = () => {
  const { navigate } = useNavigation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { walletNames, wallets } = useWallets();
  const onPress = useCallback(
    (walletId, name) => {
      const wallet = wallets[walletId];
      if (wallet.backedUp || wallet.imported) {
        navigate('SettingsBackupView', {
          imported: wallet.imported,
          title: name,
          type: 'AlreadyBackedUpView',
          walletId,
        });
      } else {
        navigate('SettingsBackupView', {
          title: name,
          type: 'NeedsBackupView',
          walletId,
        });
      }
    },
    [navigate, wallets]
  );

  const manageCloudBackups = useCallback(() => {
    const buttons = [`Delete All ${cloudPlatform} Backups`, 'Cancel'];

    showActionSheetWithOptions(
      {
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
        options: buttons,
        title: `Manage ${cloudPlatform} Backups`,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // Delete wallet with confirmation
          showActionSheetWithOptions(
            {
              cancelButtonIndex: 1,
              destructiveButtonIndex: 0,
              message: `Are you sure you want to delete your ${cloudPlatform} wallet backups?`,
              options: [`Confirm and Delete Backups`, 'Cancel'],
            },
            async buttonIndex => {
              if (buttonIndex === 0) {
                const newWallets = { ...wallets };
                Object.keys(newWallets).forEach(key => {
                  newWallets[key].backedUp = undefined;
                  newWallets[key].backupDate = undefined;
                  newWallets[key].backupFile = undefined;
                  newWallets[key].backupType = undefined;
                });

                await dispatch(walletsUpdate(newWallets));

                // Delete all backups (debugging)
                await deleteAllBackups();

                Alert.alert('Backups Deleted Succesfully');
              }
            }
          );
        }
      }
    );
  }, [dispatch, wallets]);

  let cloudBackedUpWallets = 0;

  return (
    <ScrollView>
      {Object.keys(wallets)
        .filter(key => wallets[key].type !== WalletTypes.readOnly)
        .map(key => {
          const wallet = wallets[key];
          const visibleAccounts = wallet.addresses.filter(a => a.visible);
          const account = visibleAccounts[0];
          const totalAccounts = visibleAccounts.length;
          const { color, label, index, address } = account;
          if (wallet.backupType === WalletBackupTypes.cloud) {
            cloudBackedUpWallets += 1;
          }
          let labelOrName = label;
          if (!label) {
            if (walletNames[address]) {
              labelOrName = walletNames[address];
            }
          }

          return (
            <Column key={key}>
              <ButtonPressAnimation
                onPress={() =>
                  onPress(key, label || getAddressPreview(address))
                }
                scaleTo={0.98}
              >
                <Row height={56}>
                  <Row alignSelf="center" flex={1} marginLeft={15}>
                    <ContactAvatar
                      alignSelf="center"
                      color={color}
                      marginRight={10}
                      size="smedium"
                      value={labelOrName || `${index + 1}`}
                    />
                    <ColumnWithMargins margin={3} marginBottom={0.5}>
                      <Row>
                        {labelOrName ? (
                          <Text fontWeight="600">{labelOrName}</Text>
                        ) : (
                          <TruncatedAddress address={address} />
                        )}
                      </Row>
                      {totalAccounts > 1 ? (
                        <Text fontSize={14} fontWeight="600">
                          And {totalAccounts - 1} more{' '}
                          {totalAccounts > 2 ? `accounts` : `account`}
                        </Text>
                      ) : wallet.backedUp ? (
                        wallet.backupType === WalletBackupTypes.cloud ? (
                          <Text variant="subText">Backed up</Text>
                        ) : (
                          <Text variant="subText">Backed up manually</Text>
                        )
                      ) : wallet.imported ? (
                        <Text variant="subText">Imported</Text>
                      ) : (
                        <Text color="red" variant="subText">
                          Not backed up
                        </Text>
                      )}
                    </ColumnWithMargins>
                  </Row>
                  <Row alignSelf="center" height={47} marginRight={18}>
                    {wallet.backedUp ? (
                      wallet.backupType === WalletBackupTypes.cloud ? (
                        <Icon
                          alignSelf="center"
                          iconSize="medium"
                          marginRight={2}
                          name="success"
                        />
                      ) : (
                        <Icon
                          alignSelf="center"
                          iconSize="medium"
                          marginRight={2}
                          name="success"
                        />
                      )
                    ) : wallet.imported ? (
                      <Icon
                        alignSelf="center"
                        iconSize="medium"
                        marginRight={2}
                        name="success"
                      />
                    ) : (
                      <Icon
                        alignSelf="center"
                        iconSize="medium"
                        marginRight={2}
                        name="warning"
                      />
                    )}

                    <Icon
                      alignSelf="center"
                      color="settingsGrayChevron"
                      iconSize="medium"
                      name="chevron-right"
                    />
                  </Row>
                </Row>
              </ButtonPressAnimation>
              <Divider color={colors.rowDividerFaint} inset={[0, 15, 0]} />
            </Column>
          );
        })}
      {cloudBackedUpWallets > 0 && (
        <Footer>
          <ButtonPressAnimation onPress={manageCloudBackups}>
            <Text align="center" color="backgroundBlue">
              􀍢 Manage {cloudPlatform} Backups
            </Text>
          </ButtonPressAnimation>
        </Footer>
      )}
    </ScrollView>
  );
};

export default WalletSelectionView;
