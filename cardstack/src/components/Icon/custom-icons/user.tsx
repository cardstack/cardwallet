import * as React from 'react';
import Svg, { SvgProps, Circle, G, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      {...props}
    >
      <Circle cx={10} cy={10} r={10} fill="#6b6a80" />
      <G
        data-name="icon_User (stroke)"
        transform="translate(6 5)"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <Path data-name="Path 7354" d="M8 9V8a2 2 0 00-2-2H2a2 2 0 00-2 2v1" />
        <Circle
          data-name="Ellipse 652"
          cx={2}
          cy={2}
          r={2}
          transform="translate(2)"
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
