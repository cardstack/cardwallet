import React from 'react';
import { Avatar } from '../Avatar/Avatar';
import { Container, CenteredContainer, ContainerProps } from '../Container';
import { Icon, IconProps } from '../Icon';
import { Text, TextProps } from '../Text';
import { Touchable } from '../Touchable';

interface ListItemProps extends ContainerProps {
  onPress: () => void;
  iconProps: IconProps;
  title: string;
  subText?: string;
  textProps: TextProps;
  borderIcon?: boolean;
  horizontalSpacing?: number;
  disabled?: boolean;
  avatarSrcImage?: string | null;
  avatarValue?: string | null;
}

export const ListItem = ({
  onPress,
  iconProps,
  title,
  subText,
  textProps,
  borderIcon,
  avatarSrcImage,
  avatarValue = 'Avatar',
  horizontalSpacing = 2,
  ...props
}: ListItemProps) => {
  return (
    <Container
      flexDirection="row"
      alignItems="center"
      testID="option-item"
      padding={5}
      borderWidth={1}
      {...props}
    >
      <Container flex={2} flexDirection="row">
        <CenteredContainer
          borderColor="borderGray"
          borderRadius={100}
          borderWidth={borderIcon ? 1 : 0}
          height={40}
          marginRight={horizontalSpacing}
          width={40}
          testID="option-item-icon-wrapper"
        >
          {true ? (
            <Avatar
              value={avatarValue}
              source={avatarSrcImage}
              backgroundColor="black"
            />
          ) : (
            <Icon color="settingsGray" {...iconProps} />
          )}
        </CenteredContainer>
        <Container marginLeft={4}>
          <Text fontWeight="600" {...textProps}>
            {title}
          </Text>
          {subText && (
            <Text variant="subText" marginTop={1}>
              {subText}
            </Text>
          )}
        </Container>
      </Container>
      <CenteredContainer flex={-1} alignItems="flex-end">
        <Touchable onPress={onPress}>
          <Icon name="more" color="black" />
        </Touchable>
      </CenteredContainer>
    </Container>
  );
};
