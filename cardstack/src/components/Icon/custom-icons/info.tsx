import * as React from 'react';
import Svg, { SvgProps, G, Circle, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 24.108}
      height={props.height || 26.11}
      viewBox="0 0 22 22"
    >
      <G data-name="Group 11635" transform="translate(2 2)">
        <Circle
          data-name="Ellipse 1111"
          cx={9.167}
          cy={9.167}
          r={9.167}
          transform="translate(-.167 -.167)"
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
        <Path data-name="Rectangle 2898" d="M8.083 8.083h1.833v5.5H8.083z" />
        <Circle
          data-name="Ellipse 1118"
          cx={11}
          cy={11}
          r={11}
          transform="translate(-2 -2)"
          fill={props.fill || '#0069f9'}
        />
        <Path data-name="Path 8472" d="M7.696 15.3V9h2.547v6.3z" fill="#fff" />
        <Circle
          data-name="Ellipse 1119"
          cx={1.833}
          cy={1.833}
          r={1.833}
          transform="translate(7.167 3.5)"
          fill="#fff"
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
