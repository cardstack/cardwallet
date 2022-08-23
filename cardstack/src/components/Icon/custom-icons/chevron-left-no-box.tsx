import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg {...props} viewBox="1 0 15 19">
      <Path
        data-name="Path 13212"
        d="M9.159 2.121L1.5 9.781l7.659 7.659"
        fill="none"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
      />
    </Svg>
  );
}

export default SvgComponent;
