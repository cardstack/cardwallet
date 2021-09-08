import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 13.8 13.8"
      {...props}
    >
      <Path
        data-name="Path 9136"
        d="M.7 3.65a.319.319 0 00.3-.3V1.406l5.6 5.619V13.1a.307.307 0 00.3.3.319.319 0 00.3-.3V7.02l5.614-5.614v1.949a.3.3 0 10.591 0V.7a.307.307 0 00-.3-.3h-2.659a.308.308 0 00-.3.3.326.326 0 00.3.3h1.944L6.9 6.485 1.406.991h1.949a.3.3 0 100-.591H.7a.307.307 0 00-.3.3v2.655a.306.306 0 00.3.295z"
        fill={props.fill || '#00ebe5'}
        stroke={props.stroke || '#00ebe5'}
        strokeWidth={0.8}
      />
    </Svg>
  );
}

export default SvgComponent;
