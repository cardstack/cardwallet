import * as React from 'react';
import Svg, { SvgProps, G, Rect, Circle } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      data-name="Category header - More"
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 24.108}
      height={props.height || 26.11}
      viewBox="0 0 26 26"
    >
      <G fill="none" stroke={props.stroke || '#03c4bf'}>
        <Rect width={26} height={26} rx={13} stroke="none" />
        <Rect x={0.5} y={0.5} width={25} height={25} rx={12.5} />
      </G>
      <G
        data-name="icon_3dots (stroke)"
        fill={props.fill || '#03c4bf'}
        stroke={props.stroke || '#03c4bf'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={0.5}
      >
        <G data-name="Ellipse 868" transform="translate(12 12)">
          <Circle cx={1} cy={1} r={1} stroke="none" />
          <Circle cx={1} cy={1} r={1.25} fill="none" />
        </G>
        <G data-name="Ellipse 869" transform="translate(18 12)">
          <Circle cx={1} cy={1} r={1} stroke="none" />
          <Circle cx={1} cy={1} r={1.25} fill="none" />
        </G>
        <G data-name="Ellipse 870" transform="translate(6 12)">
          <Circle cx={1} cy={1} r={1} stroke="none" />
          <Circle cx={1} cy={1} r={1.25} fill="none" />
        </G>
      </G>
    </Svg>
  );
}

export default SvgComponent;
