import React, { useMemo } from 'react';

import { Container, Touchable, Icon, Text } from '@cardstack/components';
import { ColorTypes } from '@cardstack/theme';
import { NoticeType } from '@cardstack/types';

interface NoticeStyle {
  iconColor: ColorTypes;
  backgroundColor: ColorTypes;
  textColor: ColorTypes;
}

const noticeColorConfig: Record<NoticeType, NoticeStyle> = {
  info: {
    iconColor: 'appleBlue',
    backgroundColor: 'backgroundGray',
    textColor: 'black',
  },
  warning: {
    iconColor: 'black',
    backgroundColor: 'warning',
    textColor: 'black',
  },
  error: {
    iconColor: 'black',
    backgroundColor: 'error',
    textColor: 'black',
  },
};

export interface NoticeProps {
  isVisible: boolean;
  description: string;
  onPress?: () => void;
  type?: NoticeType;
}

export const Notice = ({
  isVisible,
  description,
  onPress,
  type = 'warning',
}: NoticeProps) => {
  const iconComponent = useMemo(
    () =>
      onPress ? (
        <Container
          borderRadius={10}
          padding={1}
          backgroundColor={noticeColorConfig[type].iconColor}
        >
          <Icon
            iconSize="tiny"
            name="external-link"
            color={noticeColorConfig[type].backgroundColor}
          />
        </Container>
      ) : (
        <Icon size={20} name="info" color={noticeColorConfig[type].iconColor} />
      ),
    [onPress, type]
  );

  return (
    <>
      {isVisible && (
        <Touchable onPress={onPress} testID="notice-pressable">
          <Container
            marginHorizontal={4}
            marginVertical={2}
            alignItems="center"
            flexDirection="row"
            paddingVertical={1}
            paddingHorizontal={2}
            borderRadius={15}
            testID="notice-container"
            backgroundColor={noticeColorConfig[type].backgroundColor}
          >
            {iconComponent}
            <Container flex={1}>
              <Text
                variant="semibold"
                size="xs"
                paddingHorizontal={1}
                color={noticeColorConfig[type].textColor}
              >
                {description}
              </Text>
            </Container>
            {!!onPress && (
              <Icon
                iconSize="medium"
                name="chevron-right"
                color={noticeColorConfig[type].iconColor}
              />
            )}
          </Container>
        </Touchable>
      )}
    </>
  );
};
