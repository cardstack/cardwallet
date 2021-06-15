import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Keyboard } from 'react-native';
import {
  LongPressGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, { Easing, timing, Value } from 'react-native-reanimated';

import { useTheme } from '../../../context/ThemeContext';
import BiometryTypes from '../../../helpers/biometryTypes';
import { useBiometryIconName, useBiometryType } from '../../../hooks';
import { haptics } from '../../../utils';
import { Button } from '@cardstack/components';

const { divide, multiply, proc } = Animated;

const { ACTIVE, BEGAN, END, FAILED } = State;

const buttonScaleDurationMs = 150;
const longPressProgressDurationMs = 500;

const animate = (value, { duration = buttonScaleDurationMs, toValue }) =>
  timing(value, {
    duration,
    easing: Easing.inOut(Easing.ease),
    toValue,
  });

const calculateReverseDuration = proc(longPressProgress =>
  multiply(divide(longPressProgress, 100), longPressProgressDurationMs)
);
class HoldToAuthorizeButton extends PureComponent {
  static propTypes = {
    backgroundColor: PropTypes.string,
    biometryType: PropTypes.string,
    children: PropTypes.any,
    disabled: PropTypes.bool,
    disabledBackgroundColor: PropTypes.string,
    hideBiometricIcon: PropTypes.bool,
    hideInnerBorder: PropTypes.bool,
    isAuthorizing: PropTypes.bool,
    label: PropTypes.string,
    onLongPress: PropTypes.func.isRequired,
    shadows: PropTypes.arrayOf(PropTypes.array),
    smallButton: PropTypes.bool,
    style: PropTypes.object,
    testID: PropTypes.string,
    theme: PropTypes.oneOf(['light', 'dark']),
  };

  static defaultProps = {
    disabled: false,
    theme: 'light',
  };

  state = {
    isAuthorizing: false,
  };

  componentDidUpdate = () => {
    console.log('updating');
    if (this.state.isAuthorizing && !this.props.isAuthorizing) {
      this.onFinishAuthorizing();
    }
  };

  buttonScale = new Value(1);

  longPressProgress = new Value(0);

  onFinishAuthorizing = () => {
    if (!this.props.disabled) {
      animate(this.longPressProgress, {
        duration: calculateReverseDuration(this.longPressProgress),
        toValue: 0,
      }).start(() => this.setState({ isAuthorizing: false }));
    }
  };

  handlePress = () => {
    if (!this.state.isAuthorizing && this.props.onPress) {
      this.props.onLongPress();
    }
  };

  onLongPressChange = ({ nativeEvent: { state } }) => {
    const { disabled } = this.props;
    console.log('longpress', state, ACTIVE);
    if (state === ACTIVE && !disabled) {
      haptics.notificationSuccess();
      Keyboard.dismiss();

      animate(this.buttonScale, {
        toValue: 1,
      }).start(() => this.setState({ isAuthorizing: true }));

      this.handlePress();
    }
  };

  onTapChange = ({ nativeEvent: { state } }) => {
    const { disabled, enableLongPress } = this.props;

    if (disabled) {
      if (state === END) {
        haptics.notificationWarning();
        animate(this.buttonScale, { toValue: 1.02 }).start(() => {
          animate(this.buttonScale, { toValue: 1 }).start();
        });
      }
    } else {
      if (state === ACTIVE) {
        if (!enableLongPress) {
          this.handlePress();
        }
      } else if (state === BEGAN) {
        animate(this.buttonScale, { toValue: 0.97 }).start();
        if (enableLongPress) {
          animate(this.longPressProgress, {
            duration: longPressProgressDurationMs,
            toValue: 100,
          }).start();
        }
      } else if (state === END || state === FAILED) {
        animate(this.buttonScale, { toValue: 1 }).start();
        if (enableLongPress) {
          animate(this.longPressProgress, {
            duration: calculateReverseDuration(this.longPressProgress),
            toValue: 0,
          }).start();
        }
      }
    }
  };

  render() {
    const {
      biometryIconName,
      disabled,
      enableLongPress,
      hideBiometricIcon,
      label,
      style,
      testID,
      ...props
    } = this.props;
    const { isAuthorizing } = this.state;

    return (
      <TapGestureHandler onHandlerStateChange={this.onTapChange}>
        <Animated.View
          {...props}
          style={[style, { transform: [{ scale: this.buttonScale }] }]}
          testID={testID}
        >
          <Button
            disabled={disabled}
            iconProps={
              !android && !disabled && !hideBiometricIcon
                ? { name: biometryIconName, color: 'black' }
                : {
                    name: 'error',
                    color: 'white',
                  }
            }
            loading={android && (isAuthorizing || this.props.isAuthorizing)}
            onLongPress={enableLongPress ? this.onLongPressChange : null}
            variant={disabled ? 'invalid' : null}
          >
            {isAuthorizing || this.props.isAuthorizing ? 'Authorizing' : label}
          </Button>
        </Animated.View>
      </TapGestureHandler>
    );
  }
}

const HoldToAuthorizeButtonWithBiometrics = ({
  label,
  testID,
  onLongPress,
  ...props
}) => {
  const biometryType = useBiometryType();
  const biometryIconName = useBiometryIconName();
  const { colors } = useTheme();
  const enableLongPress =
    biometryType === BiometryTypes.FaceID ||
    biometryType === BiometryTypes.Face ||
    biometryType === BiometryTypes.none;
  return (
    <HoldToAuthorizeButton
      {...props}
      biometryIconName={biometryIconName}
      biometryType={biometryType}
      colors={colors}
      enableLongPress={enableLongPress}
      label={enableLongPress ? label : label.replace('Hold', 'Tap')}
      onLongPress={onLongPress}
      testID={testID}
    />
  );
};

export default React.memo(HoldToAuthorizeButtonWithBiometrics);
