import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import {
  Container,
  ContainerProps,
  Text,
  Touchable,
} from '@cardstack/components';
import { colors } from '@cardstack/theme';
interface SwitchSelectorOption {
  label: string;
  value: string;
}

interface SwitchSelectorProps {
  options: SwitchSelectorOption[];
  height?: number;
  borderRadius?: number;
  returnObject?: boolean;
  animationDuration?: number;
  disabled?: boolean;
  initial?: number;
  value?: number;
  onPress?: (value: string | SwitchSelectorOption) => void;
  accessibilityLabel?: string;
  testID?: string;
}

const SWIPE_DIRECTION = { LEFT: 'LEFT', RIGHT: 'RIGHT' };

const getSwipeDirection = (gestureState: PanResponderGestureState) => {
  const { dx, dy, vx } = gestureState;

  // 0.1 velocity
  if (Math.abs(vx) > 0.1 && Math.abs(dy) < 80) {
    return dx > 0 ? SWIPE_DIRECTION.RIGHT : SWIPE_DIRECTION.LEFT;
  }

  return null;
};

const shouldSetResponder = (
  evt: GestureResponderEvent,
  gestureState: PanResponderGestureState
) =>
  evt.nativeEvent.touches.length === 1 &&
  !(Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5);

export const SwitchSelector = ({
  initial = 0,
  options = [],
  height = 40,
  borderRadius = 50,
  returnObject = false,
  animationDuration = 100,
  disabled = false,
  value,
  onPress,
  accessibilityLabel,
  testID,
  ...otherProps
}: SwitchSelectorProps & ContainerProps) => {
  const [selected, setSelected] = useState<number>(initial);
  const [sliderWidth, setSliderWidth] = useState<number>();

  const animatedValue = useRef(
    new Animated.Value(initial ? initial / options.length : 0)
  ).current;

  const animate = useCallback(
    (toValue: number, last: number) => {
      animatedValue.setValue(last);
      Animated.timing(animatedValue, {
        toValue,
        duration: animationDuration,
        easing: Easing.cubic,
        useNativeDriver: true,
      }).start();
    },
    [animatedValue, animationDuration]
  );

  const toggleItem = useCallback(
    (index: number, callOnPress = true) => {
      if (options.length <= 1 || index === null || isNaN(index)) return;
      animate(index / options.length, selected / options.length);

      if (callOnPress && onPress) {
        onPress(returnObject ? options[index] : options[index].value);
      }

      setSelected(index);
    },
    [animate, onPress, options, returnObject, selected]
  );

  const responderEnd = useCallback(
    (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      if (disabled) return;
      const swipeDirection = getSwipeDirection(gestureState);

      if (
        swipeDirection === SWIPE_DIRECTION.RIGHT &&
        selected < options.length - 1
      ) {
        toggleItem(selected + 1);
      } else if (swipeDirection === SWIPE_DIRECTION.LEFT && selected > 0) {
        toggleItem(selected - 1);
      }
    },
    [disabled, options.length, selected, toggleItem]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: shouldSetResponder,
        onMoveShouldSetPanResponder: shouldSetResponder,
        onPanResponderRelease: responderEnd,
        onPanResponderTerminate: responderEnd,
      }),
    [responderEnd]
  );

  useEffect(() => {
    if (value !== undefined) {
      toggleItem(value);
    }
  }, [toggleItem, value]);

  const optionsMap = useMemo(
    () =>
      options.map((element, index) => {
        const isSelected = selected === index;

        return (
          <Touchable
            key={index}
            disabled={disabled}
            flex={1}
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            onPress={() => toggleItem(index)}
            height={height}
            borderRadius={borderRadius}
          >
            <Text
              fontWeight="600"
              fontSize={13}
              textAlign="center"
              color={isSelected ? 'black' : 'white'}
            >
              {element.label}
            </Text>
          </Touchable>
        );
      }),
    [borderRadius, disabled, height, options, selected, toggleItem]
  );

  return (
    <Container
      flexDirection="row"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      backgroundColor="darkGrayOpacity"
      borderRadius={borderRadius}
      {...otherProps}
    >
      <Container {...panResponder.panHandlers} flex={1}>
        <Container
          height={height}
          borderRadius={borderRadius}
          onLayout={event => {
            const { width } = event.nativeEvent.layout;
            setSliderWidth(width - 2);
          }}
        >
          <Container
            flex={1}
            flexDirection="row"
            borderWidth={1.5}
            borderColor="whiteLightOpacity"
            alignItems="center"
            borderRadius={borderRadius}
          >
            {!!sliderWidth && (
              <Animated.View
                style={{
                  borderRadius,
                  borderWidth: 0,
                  position: 'absolute',
                  height: height - 4, // add more space vertically
                  backgroundColor:
                    selected === -1 ? 'transparent' : colors.teal,
                  width: sliderWidth / options.length - 2,
                  transform: [
                    {
                      translateX: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, sliderWidth - 1],
                      }),
                    },
                  ],
                }}
              />
            )}
            {optionsMap}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
