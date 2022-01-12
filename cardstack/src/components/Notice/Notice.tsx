import React from 'react';

import { Container, Touchable, Icon, Text } from '@cardstack/components';
import { NoticeType } from '@cardstack/types';
import { ColorTypes } from '@cardstack/theme';

const backgroundColorByType: {
  [key in NoticeType]: ColorTypes;
} = {
  info: 'backgroundGray',
  warning: 'warning',
  error: 'error',
};

const textColorByType: {
  [key in NoticeType]: ColorTypes;
} = {
  info: 'black',
  warning: 'black',
  error: 'white',
};

const iconColorByType: {
  [key in NoticeType]: ColorTypes;
} = {
  info: 'appleBlue',
  warning: 'black',
  error: 'black',
};

export interface NoticeProps {
  isVisible: boolean;
  description: string;
  onPress?: () => void;
  type?: NoticeType;
  icon?: React.ReactNode;
}

export const Notice = ({
  isVisible,
  description,
  onPress,
  type = 'warning',
  icon,
}: NoticeProps) => {
  return (
    (isVisible && (
      <Touchable onPress={onPress} testID="notice-pressable">
        <Container
          alignItems="center"
          flexDirection="row"
          justifyContent="flex-start"
          paddingVertical={1}
          paddingHorizontal={2}
          marginHorizontal={4}
          marginVertical={2}
          borderRadius={50}
          testID="notice-container"
          backgroundColor={backgroundColorByType[type]}
        >
          {icon || (
            <Icon iconSize="medium" name="info" color={iconColorByType[type]} />
          )}
          <Container margin={1} />
          <Text fontWeight="bold" marginRight={4} color={textColorByType[type]}>
            {description}
          </Text>
        </Container>
      </Touchable>
    )) ||
    null
  );
};
