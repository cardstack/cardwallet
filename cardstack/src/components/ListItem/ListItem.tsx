import React, { useCallback, useRef, useState } from 'react';
import { ContextMenu } from '../../../../src/components/context-menu';
import { Avatar, AvatarProps } from '../Avatar/Avatar';
import { Container, CenteredContainer, ContainerProps } from '../Container';
import { Icon } from '../Icon';
import { Text, TextProps } from '../Text';
import { Touchable } from '../Touchable';

interface ListItemProps extends ContainerProps {
  actionSheetProps: {
    options: Array<string>;
    title: string;
    onPress: () => void;
  };
  title: string;
  subText?: string;
  textProps?: TextProps;
  horizontalSpacing?: number;
  disabled?: boolean;
  avatarProps?: AvatarProps;
}

export const ListItem = ({
  actionSheetProps,
  title = 'title',
  subText = 'subtext',
  textProps,
  avatarProps,
  horizontalSpacing = 2,
  ...props
}: ListItemProps) => {
  return (
    <Container
      flexDirection="row"
      alignItems="center"
      testID="option-item"
      padding={5}
      {...props}
    >
      <Container flex={2} flexDirection="row">
        <CenteredContainer
          borderColor="borderGray"
          borderRadius={100}
          height={40}
          marginRight={horizontalSpacing}
          width={40}
          testID="option-item-icon-wrapper"
        >
          <Avatar {...avatarProps} />
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
      <CenteredContainer alignItems="flex-end">
        <ContextMenu
          destructiveButtonIndex={0}
          onPressActionSheet={actionSheetProps.onPress}
          options={actionSheetProps.options}
          title={actionSheetProps.title}
        />
      </CenteredContainer>
    </Container>
  );
};
