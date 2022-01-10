import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import Animated from 'react-native-reanimated';

import { Icon } from '../icons';
import { Centered, InnerBorder } from '../layout';
import { AnimatedPressable, Container } from '@cardstack/components';
import { colors } from '@cardstack/theme';
import { Text } from '@rainbow-me/components/text';
import { position } from '@rainbow-me/styles';

const AnimatedCenter = Animated.createAnimatedComponent(Centered);

const ApplePayButtonBorderRadius = 28;
const ApplePayButtonDimensions = {
  height: 56,
  minWidth: '100%',
};

const ApplePayButton = ({ disabled, onDisabledPress, onSubmit }) => {
  const handlePress = useCallback(
    () => (disabled ? onDisabledPress() : onSubmit()),
    [disabled, onDisabledPress, onSubmit]
  );

  return (
    <AnimatedPressable
      hapticType={disabled ? 'notificationWarning' : 'selection'}
      onPress={handlePress}
      style={ApplePayButtonDimensions}
    >
      <Centered {...position.sizeAsObject('100%')}>
        <AnimatedCenter
          {...position.coverAsObject}
          {...ApplePayButtonDimensions}
          backgroundColor={colors.black}
          borderRadius={ApplePayButtonBorderRadius}
          zIndex={1}
        >
          <Centered {...position.sizeAsObject('100%')}>
            <Container marginBottom={1}>
              <Text color="white" size={20}>
                Pay with{' '}
              </Text>
            </Container>
            <Icon
              color={colors.white}
              flex={1}
              marginBottom={2}
              name="applePay"
            />
          </Centered>
          <InnerBorder radius={ApplePayButtonBorderRadius} />
        </AnimatedCenter>
      </Centered>
    </AnimatedPressable>
  );
};

ApplePayButton.propTypes = {
  disabled: PropTypes.bool,
  onDisabledPress: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default React.memo(ApplePayButton);
