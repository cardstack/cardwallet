/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 24}
      height={props.height || 24}
      viewBox="0 0 24 24"
    >
      <G data-name="SHARE">
        <Path
          data-name="Path 225"
          d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"
          transform="translate(0 0)"
          stroke="#00ebe5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          fill="none"
        />
        <Path
          data-name="Path 226"
          d="m16 6-4-4-4 4"
          transform="translate(0 0)"
          stroke="#00ebe5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          fill="none"
        />
        <Path
          data-name="Path 227"
          d="M12 2v13"
          transform="translate(0 0)"
          stroke="#00ebe5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          fill="none"
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
