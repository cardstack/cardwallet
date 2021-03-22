import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={28.165}
      height={18.011}
      viewBox="0 0 28.165 18.011"
      {...props}
    >
      <Path
        data-name="Union 14"
        d="M16.279 17.01H4.899a3.9 3.9 0 01-3.9-3.9 3.9 3.9 0 013.9-3.9h.264a8 8 0 016.655-8.092 8 8 0 019.089 5.887h1.26a5 5 0 015 5 5 5 0 01-5 5z"
        fill="none"
        stroke={props.stroke || '#03c4bf'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Svg>
  );
}

export default SvgComponent;
