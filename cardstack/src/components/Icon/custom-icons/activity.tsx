import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { palette } from '@cardstack/theme';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={props.width || 24}
      height={props.height || 24}
    >
      <Path
        data-name="Path 13294"
        d="M22 12h-4l-3 9L9 3l-3 9H2"
        strokeWidth={2}
        stroke={props.color || palette.tealLight}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;
