import * as React from 'react';
import Svg, {
  SvgProps,
  Defs,
  LinearGradient,
  Stop,
  G,
  Rect,
} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={23}
      height={17.17}
      viewBox="0 0 23 17.17"
      {...props}
    >
      <Defs>
        <LinearGradient
          id="prefix__b"
          x1={0.168}
          x2={1.072}
          y2={1.05}
          gradientUnits="objectBoundingBox"
        >
          <Stop offset={0} stopColor="#00ebe5" />
          <Stop offset={1} stopColor="#c3fc33" />
        </LinearGradient>
      </Defs>
      <G>
        <Rect
          data-name="Gradient 1"
          width={20}
          height={14.17}
          rx={2}
          transform="translate(1.5 .5)"
          fill="url(#prefix__b)"
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
