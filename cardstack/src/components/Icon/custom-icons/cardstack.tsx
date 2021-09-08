/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      //@ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      data-name="Card Wallet app icon FINAL"
      width={90}
      height={90}
      viewBox="0 0 90 90"
      {...props}
    >
      <Path
        data-name="background "
        d="M20 0h50a20 20 0 0120 20v50a20 20 0 01-20 20H20A20 20 0 010 70V20A20 20 0 0120 0z"
        fill={props.fill || '#37eb77'}
      />
      <Path
        data-name="foreground"
        d="M20.408 58.837l10.71-5.338 24.661 12.294-10.777 5.373zm-.036-13.834L31.11 39.65l38.551 19.222-10.738 5.353zm27.771.006l10.746-5.36 10.739 5.354-10.747 5.359zM20.329 31.137l10.745-5.357 24.672 12.3L45 43.439zm27.815.017l10.783-5.373 10.745 5.357-10.781 5.373zm-13.926-6.941l10.781-5.376 10.782 5.376L45 29.587z"
        fill={props.stroke || 'rgba(0,0,0,1)'}
      />
    </Svg>
  );
}

export default SvgComponent;
