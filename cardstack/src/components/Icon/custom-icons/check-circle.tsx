import * as React from 'react';
import Svg, { SvgProps, G, Circle, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line@typescript-eslint/ban-ts-comment
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={17.5}
      height={17.5}
      viewBox="0 0 17.5 17.5"
      {...props}
    >
      <G data-name="Selector 1">
        <G
          data-name="icon_Select, selected"
          transform="translate(.75 .75)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        >
          <Circle
            data-name="Ellipse 646"
            cx={8}
            cy={8}
            r={8}
            stroke={props.stroke || '#37EB77'}
            fill={props.fill || '#37EB77'}
          />
          <Path
            data-name="Path 7342"
            d="M11.152 6.182l-4.637 4.636-2.107-2.107"
            fill="none"
            stroke="#000"
          />
        </G>
      </G>
    </Svg>
  );
}

export default SvgComponent;
