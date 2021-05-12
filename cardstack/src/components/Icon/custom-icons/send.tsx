import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={25.552}
      height={25.552}
      viewBox="0 0 25.552 25.552"
      {...props}
    >
      <Path
        fill={props.color || '#000'}
        d="M10.785 15.85l1.994-7.3 1.992 7.302a.7.7 0 00.54.505l5.185 1.036a.7.7 0 00.766-1.002L13.404.68a.7.7 0 00-1.256 0l-7.855 15.71a.7.7 0 00.766 1.003l5.185-1.037a.7.7 0 00.54-.505z"
      />
    </Svg>
  );
}

export default SvgComponent;
