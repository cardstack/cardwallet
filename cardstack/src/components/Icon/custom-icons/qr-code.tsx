import * as React from 'react';
import Svg, { SvgProps, G, Path, Rect } from 'react-native-svg';
import { palette } from '@cardstack/theme';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line@typescript-eslint/ban-ts-comment
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 24.108}
      height={props.height || 26.11}
      viewBox="0 0 20 20"
    >
      <G data-name="Group 11430" fill={props.color || palette.tealLight}>
        <Path data-name="Rectangle 2861" d="M14 14h3v3h-3z" />
        <Path data-name="Rectangle 2862" d="M17 11h3v3h-3z" />
        <Path data-name="Rectangle 2863" d="M11 11h3v3h-3z" />
        <Path data-name="Rectangle 2864" d="M17 17h3v3h-3z" />
        <Path data-name="Rectangle 2865" d="M11 17h3v3h-3z" />
      </G>
      <G
        data-name="Rectangle 2866"
        fill="none"
        stroke={props.color || palette.tealLight}
        strokeWidth={1.5}
      >
        <Rect width={9} height={9} rx={2} stroke="none" />
        <Rect x={0.75} y={0.75} width={7.5} height={7.5} rx={1.25} />
      </G>
      <G
        data-name="Rectangle 2892"
        transform="translate(0 11)"
        fill="none"
        stroke={props.color || palette.tealLight}
        strokeWidth={1.5}
      >
        <Rect width={9} height={9} rx={2} stroke="none" />
        <Rect x={0.75} y={0.75} width={7.5} height={7.5} rx={1.25} />
      </G>
      <G
        data-name="Rectangle 2891"
        transform="translate(11)"
        fill="none"
        stroke={props.color || palette.tealLight}
        strokeWidth={1.5}
      >
        <Rect width={9} height={9} rx={2} stroke="none" />
        <Rect x={0.75} y={0.75} width={7.5} height={7.5} rx={1.25} />
      </G>
    </Svg>
  );
}

export default SvgComponent;
