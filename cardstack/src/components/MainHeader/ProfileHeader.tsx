import { useNavigation } from '@react-navigation/native';
import React from 'react';

import {
  Container,
  Icon,
  Text,
  Touchable,
  ContainerProps,
  IconProps,
} from '@cardstack/components';

interface Props extends ContainerProps {
  leftIconProps?: IconProps;
  showLeftIcon?: boolean;
  showSkipButton?: boolean;
  onSkipPress?: () => void;
}

const ProfileHeader = ({
  leftIconProps,
  showLeftIcon = true,
  showSkipButton = true,
  onSkipPress,
}: Props) => {
  const { goBack } = useNavigation();

  return (
    <Container
      flexDirection="row"
      alignItems="center"
      justifyContent={showLeftIcon ? 'space-between' : 'flex-end'}
      flex={0.1}
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
        <Touchable onPress={onSkipPress || goBack}>
          <Text fontSize={13} color="teal" weight="semibold">
            Skip
          </Text>
        </Touchable>
      )}
    </Container>
  );
};

export default ProfileHeader;
