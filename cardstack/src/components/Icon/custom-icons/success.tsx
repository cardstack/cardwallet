import * as React from 'react';
import Svg, { SvgProps, G, Circle, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      data-name="Icon_System Success"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      {...props}
    >
      <G data-name="Ellipse 24" fill="#37eb77" stroke="rgba(0,0,0,0.1)">
        <Circle cx={10} cy={10} r={10} stroke="none" />
        <Circle cx={10} cy={10} r={9.5} fill="none" />
      </G>
      <Path
        data-name="Path 178"
        d="M14.727 7l-6 6L6 10.273"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Svg>
  );
}

export default SvgComponent;
