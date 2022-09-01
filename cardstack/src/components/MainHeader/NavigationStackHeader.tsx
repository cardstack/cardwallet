import { useNavigation } from '@react-navigation/native';
import React, { memo, ReactNode, useCallback } from 'react';
import { Keyboard } from 'react-native';

import {
  Container,
  Icon,
  Text,
  MainHeaderWrapper,
  Touchable,
  IconProps,
  ContainerProps,
  IconName,
} from '@cardstack/components';
import { hitSlop } from '@cardstack/utils';

interface Props extends ContainerProps {
  title?: string;
  children?: ReactNode;
  canGoBack?: boolean;
  onSkipPress?: () => void;
  leftIconProps?: Omit<IconProps, 'name'> & {
    name?: IconName;
  };
}

const NavigationStackHeader = ({
  title,
  children,
  canGoBack = true,
  onSkipPress,
  leftIconProps,
  ...containerProps
}: Props) => {
  const { goBack } = useNavigation();

  const onBackPress = useCallback(() => {
    Keyboard.dismiss();
    goBack();
  }, [goBack]);

  return (
    <MainHeaderWrapper {...containerProps}>
      <Container flex={1}>
        {canGoBack && (
          <Icon
            color="teal"
            iconSize="medium"
            name="chevron-left-no-box"
            onPress={onBackPress}
            {...leftIconProps}
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
      <Container flex={1} alignItems="flex-end">
        {!!onSkipPress && (
          <Touchable onPress={onSkipPress} hitSlop={hitSlop.medium}>
            <Text fontSize={14} color="teal" variant="semibold">
              Skip
            </Text>
          </Touchable>
        )}
      </Container>
    </MainHeaderWrapper>
  );
};

export default memo(NavigationStackHeader);
