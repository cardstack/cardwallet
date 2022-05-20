import { useNavigation } from '@react-navigation/native';
import React, { memo, ReactNode, useCallback } from 'react';
import { Keyboard } from 'react-native';

import {
  Container,
  Icon,
  Text,
  MainHeaderWrapper,
} from '@cardstack/components';

import { ContainerProps } from '../Container';

interface Props extends ContainerProps {
  title?: string;
  children?: ReactNode;
  canGoBack?: boolean;
}

const NavigationStackHeader = ({
  title,
  children,
  canGoBack = true,
  ...containerProps
}: Props) => {
  const { goBack } = useNavigation();

  const onBackPress = useCallback(() => {
    Keyboard.dismiss();
    goBack();
  }, [goBack]);

  return (
    <MainHeaderWrapper {...containerProps}>
      <Container flex={1} alignItems="flex-start">
        {canGoBack && (
          <Icon
            color="teal"
            iconSize="medium"
            name="chevron-left"
            onPress={onBackPress}
            size={28}
          />
        )}
      </Container>
      <Container flex={4} alignItems="center" flexDirection="column">
        {!children
          ? !!title && (
              <Text color="white" size="body" weight="bold">
                {title}
              </Text>
            )
          : children}
      </Container>
      {/* Right end spacing so title gets properly centered. */}
      <Container flex={1} />
    </MainHeaderWrapper>
  );
};

export default memo(NavigationStackHeader);
