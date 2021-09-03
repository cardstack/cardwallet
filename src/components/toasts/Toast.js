import React, { Fragment } from 'react';
import Animated from 'react-native-reanimated';
import { useSpring as useSpringTransition } from 'react-native-redash';
import { useSafeArea } from 'react-native-safe-area-context';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { interpolate } from '../animations';
import { Icon } from '../icons';
import { RowWithMargins } from '../layout';
import { TruncatedText } from '../text';
import { useDimensions } from '@rainbow-me/hooks';
import { padding, position, shadow } from '@rainbow-me/styles';

const springConfig = {
  damping: 14,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.001,
  stiffness: 121.6,
};

const Container = styled(RowWithMargins).attrs({
  margin: 5,
  self: 'center',
})`
  ${padding(9, 11, 11, 12)};
  ${position.centered};
  ${({ theme: { colors } }) => shadow.build(0, 6, 10, colors.shadow, 0.14)};
  background-color: ${({ color }) => color};
  border-radius: 24px;
  bottom: ${({ insets }) => (insets.bottom || 40) + 3};
  max-width: ${({ deviceWidth }) => deviceWidth - 38};
  position: absolute;
  z-index: 100;
`;

const ToastsWrapper = styled.View`
  position: absolute;
  bottom: ${({ insets }) => (insets.bottom || 40) + 3};
`;

export function ToastsContainer({ children }) {
  return <ToastsWrapper>{children}</ToastsWrapper>;
}

export default function Toast({
  children,
  distance = 60,
  targetTranslate = 0,
  icon,
  isVisible = false,
  testID,
  text,
  textColor,
  ...props
}) {
  const { colors } = useTheme();
  const { width: deviceWidth } = useDimensions();
  const insets = useSafeArea();

  const animation = useSpringTransition(isVisible, springConfig);

  const opacity = interpolate(animation.value, {
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = interpolate(animation.value, {
    inputRange: [0, 1],
    outputRange: [distance, targetTranslate],
  });

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Container
        color={colors.blackOpacity50}
        deviceWidth={deviceWidth}
        insets={insets}
        testID={testID}
        {...props}
      >
        {children || (
          <Fragment>
            {icon && (
              <Icon
                color={textColor || colors.whiteLabel}
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
