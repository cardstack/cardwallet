import * as React from 'react';
import Svg, { SvgProps, G, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={28.181}
      height={16.225}
      viewBox="0 0 28.181 16.225"
      {...props}
    >
      <G transform="translate(8073.191 -7205.967)">
        <Path
          d="M-8071.6,7301.2l6.5,6.4,5.919-5.85,6.1,5.85,6.479-6.4"
          transform="translate(0 -86.988)"
          fill="none"
          stroke="#03c4bf"
          stroke-linecap="round"
          strokeWidth={2.25}
        />
        <Path
          d="M-8066.82,7297.133s7.475-6.8,15.145,0"
          transform="translate(0 -87)"
          fill="none"
          stroke="#03c4bf"
          stroke-linecap="round"
          strokeWidth={2.25}
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
