import * as React from 'react';
import Svg, { SvgProps, Circle, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      data-name="Card Wallet app icon FINAL"
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      {...props}
    >
      <Circle data-name="Ellipse 1293" cx={10} cy={10} r={10} fill="#37eb77" />
      <Path
        data-name="Path 24"
        d="M4.535 13.074l2.38-1.186 5.48 2.732-2.4 1.194zM4.527 10l2.386-1.19 8.567 4.272-2.386 1.189zm6.171 0l2.388-1.191 2.386 1.19-2.388 1.191zM4.517 6.918l2.388-1.19 5.483 2.733L10 9.652zm6.181 0l2.4-1.194 2.388 1.19-2.4 1.194zM7.604 5.376l2.4-1.195 2.4 1.195-2.4 1.194z"
        stroke="rgba(0,0,0,0)"
      />
    </Svg>
  );
}

export default SvgComponent;
