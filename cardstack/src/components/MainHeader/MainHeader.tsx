import React, { memo, ReactNode, useCallback } from 'react';

import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ContainerProps } from '../Container';
import {
  Container,
  Icon,
  Text,
  MainHeaderWrapper,
} from '@cardstack/components';
import Routes from '@rainbow-me/navigation/routesNames';
import { useAccountSettings } from '@rainbow-me/hooks';
import { networkInfo } from '@rainbow-me/helpers/networkInfo';

interface Props extends ContainerProps {
  title?: string;
  showNetwork?: boolean;
  rightIcon?: JSX.Element;
  leftIcon?: JSX.Element;
  children?: ReactNode;
}

const MainHeader = ({
  title,
  showNetwork = true,
  rightIcon,
  leftIcon,
  children,
  ...containerProps
}: Props) => {
  const { navigate } = useNavigation();
  const { network } = useAccountSettings();

  const onMenuPress = useCallback(() => navigate(Routes.SETTINGS_MODAL), [
    navigate,
  ]);

  const onRewardPress = useCallback(() => {
    Alert.alert('Rewards coming soon...');
  }, []);

  return (
    <MainHeaderWrapper {...containerProps}>
      {!leftIcon ? (
        <Icon
          color="teal"
          iconSize="medium"
          name="menu"
          onPress={onMenuPress}
          size={28}
        />
      ) : (
        leftIcon
      )}
      {!children ? (
        <Container flex={1} alignItems="center" flexDirection="column">
          {!!title && (
            <Text color="white" size="small" weight="bold">
              {title}
            </Text>
          )}
          {showNetwork && (
            <Text color="backgroundLightGray" size="xxs">
              {networkInfo[network].name}
            </Text>
          )}
        </Container>
      ) : (
        children
      )}
      {!rightIcon ? (
        <Icon
          color="teal"
          iconSize="medium"
          size={22}
          name="gift"
          onPress={onRewardPress}
        />
      ) : (
        rightIcon
      )}
    </MainHeaderWrapper>
  );
};

export default memo(MainHeader);
