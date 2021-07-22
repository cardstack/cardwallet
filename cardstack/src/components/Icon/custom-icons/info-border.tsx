import * as React from 'react';
import Svg, { SvgProps, G, Circle, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line@typescript-eslint/ban-ts-comment
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 24.108}
      height={props.height || 26.11}
      viewBox="0 0 24 24"
    >
      <G data-name="Group 11634" transform="translate(1 1)">
        <Circle
          data-name="Ellipse 1111"
          cx={11}
          cy={11}
          r={11}
          fill="none"
          stroke={props.stroke || '#000'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
        <Path
          data-name="Rectangle 2898"
          fill={props.stroke || 'none'}
          stroke={props.stroke || '#000'}
          d="M10 10.286h2v6h-2z"
        />
        <Path
          data-name="Path 8437"
          d="M11.022 5.027a1.62 1.62 0 11-1.62 1.62 1.62 1.62 0 011.62-1.62z"
          fill={props.stroke || 'none'}
          stroke={props.stroke || '#000'}
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
