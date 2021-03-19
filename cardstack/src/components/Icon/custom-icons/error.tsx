import * as React from 'react';
import Svg, { SvgProps, Circle, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      data-name="Icon_System Error"
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 24.108}
      height={props.height || 26.11}
      viewBox="0 0 20 20"
    >
      <Circle data-name="Ellipse 24" cx={10} cy={10} r={10} fill="red" />
      <Path
        data-name="Path 382"
        d="M11.254 10.864H8.911l-.49-6.924h3.322zm-2.871 3.285a1.61 1.61 0 01.432-1.218 1.752 1.752 0 011.258-.415 1.7 1.7 0 011.234.423 1.606 1.606 0 01.436 1.21 1.606 1.606 0 01-.442 1.2 1.672 1.672 0 01-1.228.432 1.722 1.722 0 01-1.248-.427 1.6 1.6 0 01-.442-1.205z"
        fill="#fff"
        stroke="rgba(0,0,0,0)"
      />
    </Svg>
  );
}

export default SvgComponent;
