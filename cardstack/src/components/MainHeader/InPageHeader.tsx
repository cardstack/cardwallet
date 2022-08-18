import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import {
  Container,
  Icon,
  Text,
  Touchable,
  ContainerProps,
  IconProps,
} from '@cardstack/components';
import { skipProfileCreation } from '@cardstack/redux/persistedFlagsSlice';

interface Props extends ContainerProps {
  leftIconProps?: IconProps;
  showLeftIcon?: boolean;
  showSkipButton?: boolean;
  skipAmount?: number;
}

const InPageHeader = ({
  leftIconProps,
  showLeftIcon = true,
  showSkipButton = true,
  skipAmount = 1,
}: Props) => {
  const { goBack, dispatch: navDispatch } = useNavigation();
  const dispatch = useDispatch();

  const onSkipPress = useCallback(() => {
    dispatch(skipProfileCreation(true));
    navDispatch(StackActions.pop(skipAmount));
  }, [navDispatch, skipAmount, dispatch]);

  return (
    <Container
      flexDirection="row"
      alignItems="center"
      minHeight="8%"
      justifyContent={showLeftIcon ? 'space-between' : 'flex-end'}
    >
      {showLeftIcon && (
        <Icon
          color="teal"
          name="chevron-left"
          onPress={goBack}
          size={30}
          left={-8}
          {...leftIconProps}
        />
      )}
      {showSkipButton && (
        <Touchable onPress={onSkipPress}>
          <Text fontSize={13} color="teal" variant="semibold">
            Skip
          </Text>
        </Touchable>
      )}
    </Container>
  );
};

export default InPageHeader;
