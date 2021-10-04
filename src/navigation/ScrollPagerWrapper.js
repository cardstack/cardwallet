import React, { forwardRef } from 'react';
import { Value } from 'react-native-reanimated';
import ScrollPager from '../helpers/ScrollPager';

export const scrollPosition = new Value(1);

export default forwardRef(function ScrollPagerWrapper(props, ref) {
  return <ScrollPager {...props} overscroll={false} ref={ref} />;
});
