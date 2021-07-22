/* eslint-disable@typescript-eslint/ban-ts-comment */
import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      //@ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      data-name="Icon_System Error"
      viewBox="0 0 500 500"
      width={props.width || 24.108}
      height={props.height || 26.11}
      fill={props.color || '#fff'}
    >
      <Path d="M249.511 0A250 250 0 000 250a250 250 0 00250 250 250 250 0 00250-250A250 250 0 00250 0a250 250 0 00-.487 0zm-39.014 98.484h83.057l-12.207 173.098h-58.594zm37.94 214.308a43.8 43.8 0 013.369 0 42.5 42.5 0 0130.86 10.595 40.15 40.15 0 0110.888 30.225 40.15 40.15 0 01-11.035 30.03 41.8 41.8 0 01-30.713 10.79 43.05 43.05 0 01-31.201-10.693 40 40 0 01-11.035-30.127 40.25 40.25 0 0110.79-30.42 43.8 43.8 0 0128.077-10.498z" />
    </Svg>
  );
}

export default SvgComponent;
