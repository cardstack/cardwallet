import React, { useLayoutEffect } from 'react';
import { Container, Touchable, Icon, Text } from '@cardstack/components';
import { NoticeType } from '@cardstack/types';
import { ColorTypes } from '@cardstack/theme';
import { layoutEasingAnimation } from '@cardstack/utils';
import { differenceInCalendarDays } from 'date-fns';
import { Colors } from 'react-native/Libraries/NewAppScreen';

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
    textColor: 'white',
  },
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
  useLayoutEffect(() => {
    layoutEasingAnimation();
  }, [isVisible]);

  return (
    <>
      {isVisible && (
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
            backgroundColor={noticeColorConfig[type].backgroundColor}
          >
            {icon || (
              <Icon
                iconSize="medium"
                name="info"
                color={noticeColorConfig[type].iconColor}
              />
            )}
            <Container margin={1} />
            <Text
              fontWeight="bold"
              marginRight={8}
              color={noticeColorConfig[type].textColor}
            >
              {description}
            </Text>
          </Container>
        </Touchable>
      )}
    </>
  );
};
