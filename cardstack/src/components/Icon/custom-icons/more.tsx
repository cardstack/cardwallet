import * as React from 'react';
import Svg, { SvgProps, Circle, G } from 'react-native-svg';
import theme from '@cardstack/theme';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      height="25"
      viewBox="-7 0 35 5"
      width={21}
      {...props}
    >
      <G fill={props.color || theme.colors.black} fillRule="evenodd">
        <Circle cx="2.5" cy="2.5" r="2.5" />
        <Circle cx="10.5" cy="2.5" r="2.5" />
        <Circle cx="18.5" cy="2.5" r="2.5" />
      </G>
    </Svg>
  );
}

export default SvgComponent;
