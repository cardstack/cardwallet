import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Device } from '@cardstack/utils';

const ShadowView = props => {
  if (Device.isIOS || props.elevation > 0) {
    return <View {...props} />;
  }
  return (
    <View
      {...props}
      elevation={Math.min(StyleSheet.flatten(props.style).shadowRadius, 5)}
    />
  );
};

export default ShadowView;
