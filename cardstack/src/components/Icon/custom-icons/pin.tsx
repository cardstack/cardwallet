import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={20.219}
      height={20.219}
      viewBox="0 0 20.219 20.219"
      {...props}
    >
      <Path
        data-name="icon_Pin"
        d="M13.206 14.83c1.043-1.044.975-2.903-.01-4.677l3.69-3.69 1.055 1.055a.7.7 0 10.99-.99l-5.239-5.239a.7.7 0 10-.99.99l1.054 1.054-3.691 3.692C8.292 6.04 6.432 5.971 5.39 7.013l.1.367 3.182 3.182-4.762 4.762s-.216.773 0 .99.99 0 .99 0l4.76-4.761 3.22 3.218z"
      />
    </Svg>
  );
}

export default SvgComponent;
