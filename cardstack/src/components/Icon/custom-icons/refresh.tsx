import * as React from 'react';
import Svg, { SvgProps, G, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={30.05}
      height={29.871}
      viewBox="0 0 30.05 29.871"
      {...props}
    >
      <G
        data-name="icon_Reload (stroke)"
        fill="none"
        stroke={props.stroke || '#03c4bf'}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path
          data-name="Path 7827"
          d="M13.097 2.436L9.082 6.895l4.46 4.014"
          strokeWidth={2.5}
        />
        <Path
          data-name="Path 7828"
          d="M7.602 12.29a9 9 0 107.839-5.538l-6.36.14"
          strokeWidth={2}
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
