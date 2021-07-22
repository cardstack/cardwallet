import * as React from 'react';
import Svg, { SvgProps, Circle } from 'react-native-svg';

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
      <Circle
        data-name="Ellipse 646"
        cx={8}
        cy={8}
        r={8}
        transform="translate(.75 .75)"
        fill={props.fill || 'none'}
        stroke={props.color || '#fff'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}

export default SvgComponent;
