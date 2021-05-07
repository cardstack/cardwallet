/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as React from 'react';
import Svg, { SvgProps, G, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      //@ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={11.102}
      height={13.523}
      viewBox="0 0 11.102 13.523"
      {...props}
    >
      <G
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <Path d="M5.551 12.523V4.249M1.414 1h8.274M1.414 8.386l4.137-4.137 4.137 4.137" />
      </G>
    </Svg>
  );
}

export default SvgComponent;
