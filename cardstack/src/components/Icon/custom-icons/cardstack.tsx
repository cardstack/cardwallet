import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      data-name="Cardstack Logo"
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 24.108}
      height={props.height || 26.11}
      viewBox="0 0 24.108 26.11"
    >
      <Path
        data-name="Path 1"
        d="M12.055 26.11l5.266-2.681-12.049-6.135-5.233 2.664z"
        fill="#00ebe5"
      />
      <Path
        data-name="Path 2"
        d="M18.856 22.647l5.247-2.671-18.835-9.592-5.247 2.671z"
        fill="#00ebe5"
      />
      <Path
        data-name="Path 3"
        d="M18.836 15.732l5.251-2.674-5.247-2.671-5.251 2.674z"
        fill="#00ebe5"
      />
      <Path
        data-name="Path 4"
        d="M5.25 3.465L0 6.138l12.054 6.138 5.251-2.674z"
        fill="#37eb77"
      />
      <Path
        data-name="Path 5"
        d="M18.84 8.819l5.268-2.681-5.25-2.673-5.273 2.677z"
        fill="#37eb77"
      />
      <Path
        data-name="Path 6"
        d="M12.054 0L6.786 2.683l5.268 2.681 5.268-2.681z"
        fill="#37eb77"
      />
    </Svg>
  );
}

export default SvgComponent;
