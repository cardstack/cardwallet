import React from 'react';
import { Container, OptionItem, Text } from '@cardstack/components';
import { Device } from '@cardstack/utils/device';

export default function RestoreSheetFirstStep({
  onManualRestore,
  enableCloudRestore,
  onCloudRestore,
  walletsBackedUp,
}) {
  return (
    <Container marginTop={2} paddingHorizontal={2}>
      <Text
        fontSize={18}
        fontWeight="bold"
        marginBottom={5}
        marginTop={2}
        textAlign="center"
      >
        Add account
      </Text>
      {enableCloudRestore && (
        <OptionItem
          iconProps={{
            name: 'download-cloud',
            size: 25,
          }}
          marginBottom={4}
          onPress={onCloudRestore}
          subText={`${walletsBackedUp} ${
            walletsBackedUp > 1 ? 'accounts are' : 'account is'
          } backed up in your iCloud`}
          title="Restore from backup"
        />
      )}
      <OptionItem
        iconProps={{
          name: 'lock',
          size: 25,
        }}
        onPress={onManualRestore}
        subText="Use the private secret phrase for your crypto account"
        title="Import via secret recovery phrase"
      />
      {Device.isAndroid && (
        <OptionItem
          iconProps={{
            name: 'download-cloud',
            size: 25,
          }}
          marginTop={4}
          onPress={onCloudRestore}
          subText={`Connect to ${Device.cloudPlatform} to restore`}
          title="Have a Card Wallet backup?"
        />
      )}
    </Container>
  );
}
