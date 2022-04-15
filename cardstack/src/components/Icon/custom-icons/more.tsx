import * as React from 'react';
import Svg, { SvgProps, Circle, G } from 'react-native-svg';

import theme from '@cardstack/theme';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      height="25"
      viewBox="-7 0 35 5"
      width={21}
      {...props}
    >
      <G fill={props.color || theme.colors.black} fillRule="evenodd">
        <Circle cx="2" cy="2.0" r="2.0" />
        <Circle cx="11" cy="2.0" r="2.0" />
        <Circle cx="20" cy="2.0" r="2.0" />
      </G>
    </Svg>
  );
}

export default SvgComponent;
