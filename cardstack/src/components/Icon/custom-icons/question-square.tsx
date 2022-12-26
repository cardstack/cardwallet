import * as React from 'react';
import Svg, { SvgProps, Text, TSpan } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 26 24"
      // {...props}
    >
      <Text
        transform="translate(13 18)"
        fill={props.fill || '#6b6a80'}
        fontSize={22}
        fontFamily="LastResort, '\\\\.LastResort'"
      >
        <TSpan x={-12.622} y={0}>
          {'\uDBC0\uDD74'}
        </TSpan>
      </Text>
    </Svg>
  );
}

export default SvgComponent;
