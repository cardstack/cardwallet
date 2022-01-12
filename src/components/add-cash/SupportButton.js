import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Centered } from '../layout';
import { Text } from '../text';
import { AnimatedPressable } from '@cardstack/components';
import { padding } from '@rainbow-me/styles';

const SupportButton = ({ label, onPress, ...props }) => {
  const { colors } = useTheme();
  return (
    <AnimatedPressable onPress={onPress}>
      <Centered
        backgroundColor={colors.alpha(colors.blueGreyDark, 0.06)}
        borderRadius={15}
        css={padding(5, 10, 6)}
        {...props}
      >
        <Text
          align="center"
          color={colors.alpha(colors.blueGreyDark, 0.6)}
          letterSpacing="roundedTight"
          size="lmedium"
          weight="semibold"
        >
          {label}
        </Text>
      </Centered>
    </AnimatedPressable>
  );
};

SupportButton.propTypes = {
  label: PropTypes.string,
  onPress: PropTypes.func,
};

export default React.memo(SupportButton);
