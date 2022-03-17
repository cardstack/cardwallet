import React, { Fragment } from 'react';
import Animated from 'react-native-reanimated';
import { useSpringTransition } from 'react-native-redash/lib/module/v1';
import { useTheme } from '../../context/ThemeContext';
import { interpolate } from '../animations';
import { Icon } from '../icons';
import { TruncatedText } from '../text';
import { Container } from '@cardstack/components';
import { useDimensions } from '@rainbow-me/hooks';
import { shadow } from '@rainbow-me/styles';

const springConfig = {
  damping: 14,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.001,
  stiffness: 121.6,
};

export default function Toast({
  distance = 60,
  targetTranslate = 0,
  ...props
}) {
  const { colors } = useTheme();
  const { width: deviceWidth, height: deviceHeight } = useDimensions();

  const { icon, isVisible, text, textColor, children } = props;

  const animation = useSpringTransition(isVisible, springConfig);

  const opacity = interpolate(animation, {
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = interpolate(animation, {
    inputRange: [0, 1],
    outputRange: [distance, targetTranslate],
  });

  const styles = useMemo(
    () => [
      shadow.build(0, 6, 10, colors.shadow, 0.14),
      {
        backgroundColor: colors.blackOpacity50,
        maxWidth: deviceWidth * 0.9,
        bottom: isVisible ? deviceHeight * 0.1 : -50,
      },
    ],
    [colors.shadow, colors.blackOpacity50, deviceWidth, isVisible, deviceHeight]
  );

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Container
        alignSelf="center"
        borderRadius={25}
        flexDirection="row"
        padding={2}
        position="absolute"
        style={styles}
        zIndex={10}
        {...props}
      >
        {children || (
          <Fragment>
            {icon && (
              <Icon
                color={textColor || colors.whiteLabel}
                marginRight={3}
                marginTop={3}
                name={icon}
              />
            )}
            <TruncatedText
              color={textColor || colors.whiteLabel}
              size="smedium"
              weight="bold"
            >
              {text}
            </TruncatedText>
          </Fragment>
        )}
      </Container>
    </Animated.View>
  );
}
