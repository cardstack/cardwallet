import * as React from 'react';
import Svg, { ClipPath, Path, G, Rect, SvgProps } from 'react-native-svg';
import { colors } from '@cardstack/theme';
/* Doesn't currently work as expected since
SVGR has dropped some elements not supported by react-native-svg: filter */

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      height={307}
      viewBox="0 0 307 307"
      width={307}
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      // xmlns="http://www.w3.org/2000/svg"
    >
      <ClipPath id="prefix__a">
        <Path
          d="M-10284-7111v-69h69v69zm-238 0v-69h69v69zm238-238v-69h69v69zm-238 0v-69h69v69z"
          transform="translate(10556 7608)"
        />
      </ClipPath>
      <G clipPath="url(#prefix__a)" transform="translate(-33.999 -190)">
        <G filter="url(#prefix__b)" transform="translate(34 190)">
          <G
            fill="none"
            stroke={props.color || colors.white}
            strokeWidth={5}
            transform="translate(10 10)"
          >
            <Rect height={287} rx={20} width={287} stroke="none" />
            <Rect height={282} rx={17.5} width={282} x={2.5} y={2.5} />
          </G>
        </G>
      </G>
    </Svg>
  );
}

export default SvgComponent;
