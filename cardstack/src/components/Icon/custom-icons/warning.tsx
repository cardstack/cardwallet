import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

function SvgComponent({ fill = '#ffa700', stroke = '#fff' }: SvgProps) {
  return (
    <Svg
      data-name="Icon_System Warning"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={21.006}
      viewBox="0 0 24 21.006"
    >
      <Path
        data-name="Path 455"
        d="M2.059 21.006L.383 17.852l9.8-16.723 1.838-1.09 1.789 1.09 9.809 16.723-1.549 3.154z"
        fill={fill}
      />
      <Path
        data-name="Path 382"
        d="M13.139 13.342h-2.343l-.49-6.924h3.327zm-2.871 3.288a1.61 1.61 0 01.432-1.22 1.752 1.752 0 011.258-.413 1.7 1.7 0 011.234.423 1.606 1.606 0 01.441 1.21 1.606 1.606 0 01-.442 1.2 1.672 1.672 0 01-1.229.437 1.722 1.722 0 01-1.252-.437 1.6 1.6 0 01-.442-1.2z"
        fill={stroke ?? '#fff'} // using stroke as fill-color to enable two-color component
      />
      <Circle
        data-name="Ellipse 43"
        cx={2}
        cy={2}
        r={2}
        transform="translate(10)"
        fill={fill}
      />
      <Circle
        data-name="Ellipse 44"
        cx={2}
        cy={2}
        r={2}
        transform="translate(0 17)"
        fill={fill}
      />
      <Circle
        data-name="Ellipse 45"
        cx={2}
        cy={2}
        r={2}
        transform="translate(20 17)"
        fill={fill}
      />
    </Svg>
  );
}

export default SvgComponent;
