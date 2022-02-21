import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components';

import { useTheme } from '../../../context/ThemeContext';
import Divider from '../../Divider';
import { ButtonPressAnimation } from '../../animations';
import { ContactAvatar } from '../../contacts';
import { Centered, Column, ColumnWithMargins, Row } from '../../layout';
import { Icon, Text, TruncatedAddress } from '@cardstack/components';
import {
  getAddressPreview,
  getSymbolCharacterFromAddress,
} from '@cardstack/utils';
import { Device } from '@cardstack/utils/device';
import WalletBackupTypes from '@rainbow-me/helpers/walletBackupTypes';
import WalletTypes from '@rainbow-me/helpers/walletTypes';
import { useManageCloudBackups, useWallets } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import { padding } from '@rainbow-me/styles';

const Footer = styled(Centered)`
  flex: 1;
  align-items: flex-end;
  ${padding(19, 15, 30)};
`;

const style = { paddingTop: 10 };

const WalletSelectionView = () => {
  const { navigate } = useNavigation();
  const { colors } = useTheme();
  const { walletNames, wallets } = useWallets();
  const { manageCloudBackups } = useManageCloudBackups();
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

  let cloudBackedUpWallets = 0;

  return (
    <ScrollView style={style}>
      {Object.keys(wallets)
        .filter(key => wallets[key].type !== WalletTypes.readOnly)
        .map(key => {
          const wallet = wallets[key];
          const visibleAccounts = wallet.addresses.filter(a => a.visible);
          const account = visibleAccounts[0];
          const totalAccounts = visibleAccounts.length;
          const { color, label, address } = account;
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
                      value={
                        labelOrName || getSymbolCharacterFromAddress(address)
                      }
                    />
                    <ColumnWithMargins margin={3} marginBottom={0.5}>
                      <Row>
                        {labelOrName ? (
                          <Text weight="bold">{labelOrName}</Text>
                        ) : (
                          <TruncatedAddress address={address} />
                        )}
                      </Row>
                      {totalAccounts > 1 ? (
                        <Text fontSize={14} weight="bold">
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
              Manage {Device.cloudPlatform} Backups
            </Text>
          </ButtonPressAnimation>
        </Footer>
      )}
    </ScrollView>
  );
};

export default WalletSelectionView;
