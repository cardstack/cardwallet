import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Keyboard } from 'react-native';
import {
  LongPressGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import { EasingNode, timing, Value } from 'react-native-reanimated';

import { useTheme } from '../../../context/ThemeContext';
import BiometryTypes from '../../../helpers/biometryTypes';
import { useBiometryIconName, useBiometryType } from '../../../hooks';
import { haptics } from '../../../utils';
import { Button, Container } from '@cardstack/components';

const { ACTIVE, END } = State;

const buttonScaleDurationMs = 150;
const longPressProgressDurationMs = 450;

const animate = (value, { duration = buttonScaleDurationMs, toValue }) =>
  timing(value, {
    duration,
    easing: EasingNode.inOut(EasingNode.ease),
    toValue,
  });

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
    onPress: PropTypes.func.isRequired,
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
    if (this.state.isAuthorizing && !this.props.isAuthorizing) {
      this.onFinishAuthorizing();
    }
  };

  buttonScale = new Value(1);

  longPressProgress = new Value(0);

  onFinishAuthorizing = () => {
    if (!this.props.disabled) {
      this.setState({ isAuthorizing: false });
    }
  };

  handlePress = () => {
    if (!this.state.isAuthorizing && this.props.onPress) {
      this.props.onPress();
    }
  };

  onLongPressChange = ({ nativeEvent: { state } }) => {
    const { disabled } = this.props;
    if (state === ACTIVE && !disabled) {
      haptics.notificationSuccess();
      Keyboard.dismiss();

      this.setState({ isAuthorizing: true });

      this.handlePress();
    }
  };

  onTapChange = ({ nativeEvent: { state } }) => {
    const { disabled } = this.props;
    if (disabled) {
      if (state === END) {
        haptics.notificationWarning();
        animate(this.buttonScale, { toValue: 1.02 }).start(() => {
          animate(this.buttonScale, { toValue: 1 }).start();
        });
      }
    } else {
      if (state === ACTIVE) {
        this.handlePress();
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
      <LongPressGestureHandler
        enabled={enableLongPress}
        minDurationMs={longPressProgressDurationMs}
        onHandlerStateChange={this.onLongPressChange}
      >
        <TapGestureHandler
          enabled={!enableLongPress}
          onHandlerStateChange={this.onTapChange}
        >
          <Container {...props} style={style} testID={testID}>
            <Button
              disablePress={disabled}
              iconProps={
                !android && !disabled && !hideBiometricIcon
                  ? { name: biometryIconName, color: 'black' }
                  : {
                      name: 'error',
                      color: 'white',
                    }
              }
              loading={android && (isAuthorizing || this.props.isAuthorizing)}
              style={{ width: '100%' }}
              variant={disabled ? 'disabledInvalid' : null}
            >
              {isAuthorizing || this.props.isAuthorizing
                ? 'Authorizing'
                : label}
            </Button>
          </Container>
        </TapGestureHandler>
      </LongPressGestureHandler>
    );
  }
}

const HoldToAuthorizeButtonWithBiometrics = ({ label, testID, ...props }) => {
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
      testID={testID}
    />
  );
};

export default React.memo(HoldToAuthorizeButtonWithBiometrics);
