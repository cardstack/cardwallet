/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 19}
      height={props.height || 16}
      viewBox="0 0 19 16"
    >
      <G data-name="Group 12953">
        <Path
          data-name="Path 9545"
          d="M-2179.171-13977.027h15.162l-4.555-4.316"
          transform="translate(2181 13983)"
          stroke="#03c4bf"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          fill="none"
        />
        <Path
          data-name="Path 9546"
          d="M-2164.01-13981.344h-15.162l4.555 4.316"
          transform="translate(2182 13992)"
          stroke="#03c4bf"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          fill="none"
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
