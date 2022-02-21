import React, { memo, useCallback, useMemo } from 'react';

import { useSafeArea } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container, Icon, Text } from '@cardstack/components';
import Routes from '@rainbow-me/navigation/routesNames';
import { useAccountSettings } from '@rainbow-me/hooks';
import { networkInfo } from '@rainbow-me/helpers/networkInfo';

const MainHeader = ({ title }: { title: string }) => {
  const { navigate } = useNavigation();
  const { network } = useAccountSettings();

  const insets = useSafeArea();
  const style = useMemo(() => ({ paddingTop: insets.top + 10 }), [insets]);

  const onMenuPress = useCallback(() => navigate(Routes.SETTINGS_MODAL), [
    navigate,
  ]);

  const onRewardPress = useCallback(() => {
    Alert.alert('Rewards coming soon...');
  }, []);

  return (
    <Container
      backgroundColor="backgroundBlue"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      padding={4}
      style={style}
    >
      <Icon
        color="teal"
        iconSize="medium"
        name="menu"
        onPress={onMenuPress}
        size={28}
      />
      <Container
        flex={1}
        alignSelf="flex-end"
        alignItems="center"
        justifyContent="space-between"
        flexDirection="column"
        paddingTop={2}
      >
        <Text color="white" size="small" weight="bold">
          {title}
        </Text>
        <Text color="backgroundLightGray" size="xxs">
          {networkInfo[network].name}
        </Text>
      </Container>
      <Icon
        color="teal"
        iconSize="medium"
        size={22}
        name="gift"
        onPress={onRewardPress}
      />
    </Container>
  );
};

export default memo(MainHeader);
