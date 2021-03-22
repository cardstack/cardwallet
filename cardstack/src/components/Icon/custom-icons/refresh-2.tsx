import * as React from 'react';
import Svg, { SvgProps, Defs, G, Path } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style */

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={20.027}
      height={18.01}
      viewBox="0 0 20.027 18.01"
      {...props}
    >
      <Defs />
      <G id="prefix__icon_Restore" transform="translate(1.272 1.105)">
        <Path
          id="prefix__Path_8577"
          data-name="Path 8577"
          d="M1 4v5.333h5.333"
          transform="translate(-1 -3.119)"
          fill="none"
          strokeWidth={1.8}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <Path
          id="prefix__Path_8578"
          data-name="Path 8578"
          d="M3.231 13.667a8 8 0 101.893-8.32L1 9.223"
          transform="translate(-1 -3.009)"
          fill="none"
          strokeWidth={1.8}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
