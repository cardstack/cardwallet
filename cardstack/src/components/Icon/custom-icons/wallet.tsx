import * as React from 'react';
import Svg, { SvgProps, G, Rect, Path } from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg width={20.85} height={15.6} {...props}>
    <G data-name="icon V2" transform="translate(-.2 -3.2)">
      <Rect
        data-name="Rectangle 2869"
        width={18.5}
        height={14}
        rx={3}
        transform="translate(1 4)"
        fill="none"
        stroke={props.color || '#afafb7'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
      />
      <Path
        data-name="Path 9230"
        d="M13.454 12.08a2.3 2.3 0 0 1-1.543-.6 7.668 7.668 0 0 1-1.054-1.044 2.182 2.182 0 0 0-1.486-.761H2.184v-.3h7.2a2.488 2.488 0 0 1 1.7.868 7.388 7.388 0 0 0 1.02 1.01 2.015 2.015 0 0 0 1.446.525h6.072v.3h-6.065Z"
        fill={props.color || '#afafb7'}
      />
      <Path
        data-name="Path 9230 - Outline"
        d="M13.454 12.68a2.919 2.919 0 0 1-1.934-.746 8.249 8.249 0 0 1-1.121-1.112 1.584 1.584 0 0 0-1.054-.548H1.584v-1.5h7.853a3.092 3.092 0 0 1 2.111 1.076l.005.006a6.792 6.792 0 0 0 .937.928l.026.023a1.424 1.424 0 0 0 1.014.368h6.7v1.5h-6.65Z"
        fill={props.color || '#afafb7'}
      />
    </G>
  </Svg>
);

export default SvgComponent;
