import React from 'react';
import { Container, IconProps, OptionItem, Text } from '@cardstack/components';
import { Device } from '@cardstack/utils/device';

interface RestoreSheetFirstStepProps {
  enableCloudRestore: boolean;
  noBackupsFound: boolean;
  onCloudRestore: () => Promise<void>;
  onManualRestore: () => Promise<void>;
  walletsBackedUp: any;
}

const cloudIconProps = {
  name: 'download-cloud',
  size: 25,
} as IconProps;

export default function RestoreSheetFirstStep({
  enableCloudRestore,
  noBackupsFound,
  onCloudRestore,
  onManualRestore,
  walletsBackedUp,
}: RestoreSheetFirstStepProps) {
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
          iconProps={cloudIconProps}
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
      {Device.isAndroid && !noBackupsFound && (
        <OptionItem
          iconProps={cloudIconProps}
          marginTop={4}
          onPress={onCloudRestore}
          subText={`Connect to ${Device.cloudPlatform} to restore`}
          title="Have a Card Wallet backup?"
        />
      )}
      {Device.isAndroid && noBackupsFound && (
        <OptionItem
          disabled
          iconProps={cloudIconProps}
          marginTop={4}
          subText="Connected. No backups available."
          title={`No backups found in ${Device.cloudPlatform}`}
        />
      )}
    </Container>
  );
}
