import PropTypes from 'prop-types';
import React from 'react';

import { Container } from '@cardstack/components';

import { shadow } from '@rainbow-me/styles';
import colors from '@rainbow-me/styles/colors';

const FloatingPanelBorderRadius = 18;

export const FloatingPanelPadding = {
  x: 19,
  y: 0,
};

const FloatingPanelShadow = colors =>
  shadow.build(0, 10, 50, colors.shadow, 0.6);

const FloatingPanel = ({
  color,
  height = 'auto',
  hideShadow = true,
  overflow = 'hidden',
  radius = FloatingPanelBorderRadius,
  testID,
  ...props
}) => {
  return (
    <Container
      {...props}
      backgroundColor={color || 'white'}
      borderRadius={radius}
      hideShadow={hideShadow ? '' : FloatingPanelShadow(colors)}
      minHeight={height}
      overflow={overflow}
      testID={testID + '-container'}
    />
  );
};

FloatingPanel.propTypes = {
  color: PropTypes.string,
  height: PropTypes.number,
  hideShadow: PropTypes.bool,
  overflow: PropTypes.string,
  radius: PropTypes.number,
  width: PropTypes.number,
};

FloatingPanel.padding = FloatingPanelPadding;
FloatingPanel.borderRadius = FloatingPanelBorderRadius;

export default FloatingPanel;
