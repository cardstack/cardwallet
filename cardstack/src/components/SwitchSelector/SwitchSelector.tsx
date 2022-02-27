import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Animated,
  Easing,
  I18nManager,
  Image,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
  GestureResponderEvent,
  PanResponderGestureState,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animated: {
    borderWidth: 0,
    position: 'absolute',
  },
});

interface SwitchSelectorOption {
  label: string;
  value: number;
  customIcon?: (_: boolean) => JSX.Element;
  imageIcon: ImageSourcePropType;
  accessibilityLabel?: string;
  testID?: string;
}

interface SwitchSelectorProps {
  options: SwitchSelectorOption[];
  height: number;
  returnObject: boolean;
  animationDuration: number;
  disabled: boolean;
  disableValueChangeOnPress: boolean;
  initial: number;
  value: number;
  onPress: (value: number | SwitchSelectorOption) => void;
  accessibilityLabel: string;
  testID: string;
}

export const SwitchSelector = ({
  initial = -1,
  options = [],
  height = 40,
  returnObject = false,
  animationDuration = 100,
  disabled = false,
  disableValueChangeOnPress = false,
  value = 1,
  onPress,
  accessibilityLabel,
  testID,
}: SwitchSelectorProps) => {
  const [selected, setSelected] = useState<number>(initial);
  const [sliderWidth, setSliderWidth] = useState<number>(initial);

  const animatedValue = useMemo(
    () =>
      new Animated.Value(
        initial
          ? I18nManager.isRTL
            ? -(initial / options.length)
            : initial / options.length
          : 0
      ),
    [initial, options]
  );

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
      animate(
        I18nManager.isRTL ? -(index / options.length) : index / options.length,
        I18nManager.isRTL
          ? -(selected / options.length)
          : selected / options.length
      );

      if (callOnPress && onPress) {
        onPress(returnObject ? options[index] : options[index].value);
      } else {
        console.log('Call onPress with value: ', options[index].value);
      }

      setSelected(index);
    },
    [animate, onPress, options, returnObject, selected]
  );

  const getSwipeDirection = useCallback(
    (gestureState: PanResponderGestureState) => {
      const { dx, dy, vx } = gestureState;

      // 0.1 velocity
      if (Math.abs(vx) > 0.1 && Math.abs(dy) < 80) {
        return dx > 0 ? 'RIGHT' : 'LEFT';
      }

      return null;
    },
    []
  );

  const responderEnd = useCallback(
    (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      if (disabled) return;
      const swipeDirection = getSwipeDirection(gestureState);

      if (swipeDirection === 'RIGHT' && selected < options.length - 1) {
        toggleItem(selected + 1);
      } else if (swipeDirection === 'LEFT' && selected > 0) {
        toggleItem(selected - 1);
      }
    },
    [disabled, getSwipeDirection, options.length, selected, toggleItem]
  );

  const shouldSetResponder = useCallback(
    (evt: GestureResponderEvent, gestureState: PanResponderGestureState) =>
      evt.nativeEvent.touches.length === 1 &&
      !(Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5),
    []
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: shouldSetResponder,
        onMoveShouldSetPanResponder: shouldSetResponder,
        onPanResponderRelease: responderEnd,
        onPanResponderTerminate: responderEnd,
      }),
    [responderEnd, shouldSetResponder]
  );

  useEffect(() => {
    toggleItem(value, !disableValueChangeOnPress);
  }, [disableValueChangeOnPress, toggleItem, value]);

  const optionsMap = options.map((element, index) => {
    const isSelected = selected === index;

    return (
      <TouchableOpacity
        key={index}
        disabled={disabled}
        style={styles.button}
        onPress={() => toggleItem(index)}
        accessibilityLabel={element.accessibilityLabel}
        testID={element.testID}
      >
        {typeof element.customIcon === 'function'
          ? element.customIcon(isSelected)
          : element.customIcon}
        {element.imageIcon && (
          <Image
            source={element.imageIcon}
            style={[
              {
                height: 30,
                width: 30,
                tintColor: '#fff',
              },
            ]}
          />
        )}
        <Text
          style={[
            {
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#fff',
              backgroundColor: 'transparent',
            },
          ]}
        >
          {element.label}
        </Text>
      </TouchableOpacity>
    );
  });

  return (
    <View
      style={[{ flexDirection: 'row' }]}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <View {...panResponder.panHandlers} style={{ flex: 1 }}>
        <View
          style={{
            height,
          }}
          onLayout={event => {
            const { width } = event.nativeEvent.layout;
            setSliderWidth(width - 2);
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              borderWidth: 0,
              alignItems: 'center',
            }}
          >
            {!!sliderWidth && (
              <Animated.View
                style={[
                  {
                    height,
                    backgroundColor: selected === -1 ? 'transparent' : '#fff',
                    width: sliderWidth / options.length,
                    transform: [
                      {
                        translateX: animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, sliderWidth - 0],
                        }),
                      },
                    ],
                  },
                  styles.animated,
                ]}
              />
            )}
            {optionsMap}
          </View>
        </View>
      </View>
    </View>
  );
};
