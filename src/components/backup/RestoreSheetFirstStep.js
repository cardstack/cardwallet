import React from 'react';
import styled from 'styled-components';

import { Column } from '../layout';
import { OptionItem, Text } from '@cardstack/components';

const Wrapper = styled(Column)`
  margin-top: -8;
`;

export default function RestoreSheetFirstStep({
  onManualRestore,
  onWatchAddress,
}) {
  // Temp disabling iCloud restore

  // const { setParams } = useNavigation();

  // const walletsBackedUp = useMemo(() => {
  //   let count = 0;
  //   forEach(userData?.wallets, wallet => {
  //     console.log({ userData });
  //     if (wallet.backedUp && wallet.backupType === WalletBackupTypes.cloud) {
  //       count++;
  //     }
  //   });
  //   console.log({ count });
  //   return count;
  // }, [userData]);

  // const enableCloudRestore = android || walletsBackedUp > 0;
  // useEffect(() => {
  //   setParams({ enableCloudRestore });
  // }, [enableCloudRestore, setParams]);

  return (
    <Wrapper>
      <Text
        fontSize={18}
        fontWeight="700"
        marginBottom={10}
        marginTop={2}
        textAlign="center"
      >
        Add account
      </Text>
      {/* {enableCloudRestore && (
        <OptionItem
          horizontalSpacing={4}
          iconProps={{
            name: 'download-cloud',
            size: 25,
          }}
          marginVertical={4}
          onPress={onCloudRestore}
          subText={`${walletsBackedUp} ${
            walletsBackedUp > 1 ? 'accounts are' : 'account is'
          } backed up in your iCloud`}
          title="Restore from backup"
        />
      )} */}
      <OptionItem
        horizontalSpacing={4}
        iconProps={{
          name: 'lock',
          size: 25,
        }}
        marginVertical={4}
        onPress={onManualRestore}
        subText="Use the private key for your crypto account"
        title="Import via secret recovery phrase"
      />
      <OptionItem
        horizontalSpacing={4}
        iconProps={{
          name: 'search',
          size: 25,
        }}
        marginVertical={4}
        onPress={onWatchAddress}
        subText="Track an ENS name or public address"
        title="Monitor an Ethereum address"
      />
    </Wrapper>
  );
}
