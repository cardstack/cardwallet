import React, { memo } from 'react';

import {
  Text,
  Icon,
  Button,
  AbsoluteFullScreenContainer,
} from '@cardstack/components';

import { strings } from '../strings';

interface Props {
  onEnableCameraPress: () => void;
}

const CameraNotAuthorizedView = ({ onEnableCameraPress }: Props) => {
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
      <Button onPress={onEnableCameraPress}>
        <Text>{strings.authorize.cameraBtn}</Text>
      </Button>
    </AbsoluteFullScreenContainer>
  );
};

export default memo(CameraNotAuthorizedView);
