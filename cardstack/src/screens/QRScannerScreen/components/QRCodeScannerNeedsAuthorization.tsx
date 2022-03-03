import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import { Text, Icon, CenteredContainer, Button } from '@cardstack/components';

export default function QRCodeScannerNeedsAuthorization() {
  const handlePressSettings = useCallback(() => {
    Linking.canOpenURL('app-settings:').then(() =>
      Linking.openURL('app-settings:')
    );
  }, []);

  return (
    <CenteredContainer
      backgroundColor="black"
      position="absolute"
      flex={1}
      padding={30}
      justifyContent="center"
      alignItems="center"
    >
      <Icon name="camera-icon" color="mintDark" size={43} />
      <Text
        textAlign="center"
        color="white"
        fontSize={20}
        fontWeight="600"
        marginBottom={30}
        marginTop={5}
      >
        Scan to pay or connect
      </Text>
      <Text
        textAlign="center"
        color="blueGreyDark"
        size="medium"
        fontWeight="600"
        marginBottom={10}
      >
        Camera access needed to scan!
      </Text>
      <Button onPress={handlePressSettings} padding={5}>
        <Text textAlign="center" color="black" fontWeight="600" fontSize={18}>
          Enable camera access
        </Text>
      </Button>
    </CenteredContainer>
  );
}
