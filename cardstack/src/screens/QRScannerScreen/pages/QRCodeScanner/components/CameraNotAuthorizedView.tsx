import React, { memo, useCallback } from 'react';
import { Linking } from 'react-native';
import { strings } from '../strings';
import {
  Text,
  Icon,
  Button,
  AbsoluteFullScreenContainer,
} from '@cardstack/components';

const CameraNotAuthorizedView = () => {
  const handlePressSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  return (
    <AbsoluteFullScreenContainer
      backgroundColor="backgroundDarkPurple"
      justifyContent="center"
      paddingVertical={4}
      alignItems="center"
      zIndex={3}
    >
      <Icon name="camera-icon" color="teal" size={43} />
      <Text
        textAlign="center"
        color="white"
        fontSize={20}
        fontWeight="600"
        marginBottom={10}
        marginTop={5}
      >
        {strings.authorize.info}
      </Text>
      <Button onPress={handlePressSettings}>
        <Text>{strings.authorize.cameraBtn}</Text>
      </Button>
    </AbsoluteFullScreenContainer>
  );
};

export default memo(CameraNotAuthorizedView);
