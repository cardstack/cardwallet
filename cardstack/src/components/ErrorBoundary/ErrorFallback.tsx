import React, { memo, useCallback } from 'react';
import RNRestart from 'react-native-restart';
import {
  SafeAreaView,
  Text,
  CenteredContainer,
  Button,
} from '@cardstack/components';
import logger from 'logger';

const ErrorFallback = ({
  message = 'something went wrong',
}: {
  message?: string;
}) => {
  const handleOnPress = useCallback(() => {
    logger.sentry('Restart app on error', message);
    RNRestart.Restart();
  }, [message]);

  return (
    <SafeAreaView backgroundColor="backgroundBlue" flex={1}>
      <CenteredContainer flex={1} paddingHorizontal={5}>
        <Text size="large" textAlign="center" color="white" weight="bold">
          Uh oh!
        </Text>
        <Text
          paddingTop={2}
          size="medium"
          textAlign="center"
          color="white"
        >{`It appears ${message}.\n\nDon't worry, your wallets are safe!\nJust restart the app.`}</Text>
        <Button marginTop={5} onPress={handleOnPress}>
          Restart
        </Button>
      </CenteredContainer>
    </SafeAreaView>
  );
};

export default memo(ErrorFallback);
