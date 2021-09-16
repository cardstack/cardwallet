import * as React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

function DoubleCaretSvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={10.328}
      height={17}
      {...props}
    >
      <G
        data-name="icon_Dropdown select (stroke)"
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <Path data-name="Path 8523" d="M8.914 4.75L5.164 1l-3.75 3.75" />
        <Path data-name="Path 8524" d="M1.414 12.25L5.164 16l3.75-3.75" />
      </G>
    </Svg>
  );
}

export default DoubleCaretSvgComponent;
