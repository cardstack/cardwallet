import { isNil } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated, { Easing } from 'react-native-reanimated';
import { useTiming } from 'react-native-redash';

import { useInterval, useTimeout, useTransformOrigin } from '../../hooks';
import { magicMemo } from '../../utils';
import { interpolate } from '../animations';
import { CenteredContainer, Text } from '@cardstack/components';
import { position } from '@rainbow-me/styles';

const AnimatedText = Animated.createAnimatedComponent(Text);

const SheetSubtitleCyclerItem = ({ error, selected, subtitle }) => {
  const ease = Easing[error ? 'out' : 'in'](Easing.ease);

  const opacity = useTiming(selected, {
    duration: 200,
    ease,
  }).value;

  return (
    <Animated.View {...position.coverAsObject} style={{ opacity }}>
      <AnimatedText
        color="grayText"
        fontSize={13}
        fontWeight="600"
        textAlign="center"
        textTransform="uppercase"
      >
        {subtitle}
      </AnimatedText>
    </Animated.View>
  );
};

const MemoizedSheetSubtitleCyclerItem = React.memo(SheetSubtitleCyclerItem);

const SheetSubtitleCycler = ({
  animatedValue,
  defaultSelectedIndex,
  errorIndex,
  interval,
  items,
  ...props
}) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex);
  const { onLayout, withTransformOrigin } = useTransformOrigin('top');

  const [startInterval, stopInterval] = useInterval();
  const [startTimeout, stopTimeout] = useTimeout();
  const clearTimers = useCallback(() => {
    stopInterval();
    stopTimeout();
  }, [stopInterval, stopTimeout]);

  const cycleTextOnce = useCallback(
    () => setSelectedIndex(i => (i + 1) % items.length),
    [items]
  );

  const startCycling = useCallback(
    () => startInterval(() => cycleTextOnce(), interval),
    [cycleTextOnce, interval, startInterval]
  );

  useEffect(() => {
    if (!isNil(errorIndex)) {
      clearTimers();
      setSelectedIndex(errorIndex);
    } else {
      stopInterval();
      startCycling();
    }
  }, [clearTimers, errorIndex, startCycling, stopInterval]);

  const handlePress = useCallback(() => {
    clearTimers();
    cycleTextOnce();
    startTimeout(() => startCycling(), interval);
  }, [clearTimers, cycleTextOnce, interval, startCycling, startTimeout]);

  const scale = Animated.cond(
    !isNil(errorIndex),
    interpolate(animatedValue, {
      inputRange: [-20, -10, 0, 10, 20],
      outputRange: [1.025, 1.25, 1, 1.25, 1.025],
    }),
    1
  );

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <CenteredContainer flex={-1} width="100%" {...props}>
        <Animated.View
          {...position.coverAsObject}
          onLayout={onLayout}
          style={{ transform: withTransformOrigin({ scale }) }}
        >
          {items.map((subtitle, index) => (
            <MemoizedSheetSubtitleCyclerItem
              error={index === errorIndex}
              key={subtitle}
              selected={index === selectedIndex}
              subtitle={subtitle}
            />
          ))}
        </Animated.View>
      </CenteredContainer>
    </TouchableWithoutFeedback>
  );
};

SheetSubtitleCycler.propTypes = {
  animatedValue: PropTypes.object,
  defaultSelectedIndex: PropTypes.number,
  errorIndex: PropTypes.number,
  interval: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(PropTypes.string),
};

SheetSubtitleCycler.defaultProps = {
  defaultSelectedIndex: 0,
  interval: 3000,
};

export default magicMemo(SheetSubtitleCycler, [
  'animatedValue',
  'errorIndex',
  'interval',
  'items',
]);
