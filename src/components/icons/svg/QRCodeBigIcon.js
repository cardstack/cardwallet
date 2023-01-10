import React from 'react';
import { G, Path, Rect } from 'react-native-svg';

import Svg from '../Svg';

// @ts-ignore
const QRCodeBigIcon = props => {
  return (
    <Svg fill="#000" height={39} viewBox="0 0 40 39" width={40} {...props}>
      <G data-name="Group 12649">
        <G data-name="Group 12648">
          <G
            data-name="Rectangle 3350"
            fill="none"
            stroke="#000"
            strokeWidth={3}
            transform="translate(1 1)"
          >
            <Rect height={37} rx={6} stroke="none" width={38} />
            <Rect height={34} rx={4.5} width={35} x={1.5} y={1.5} />
          </G>
          <Path
            d="M12.093 39V27.858H0V12.073h12.093V0h15.815v12.073H40v15.785H27.908V39z"
            data-name="Union 19"
            fill="#fff"
          />
        </G>
        <Path
          d="M8.29 7.826v6.831h6.831V7.826zm4.879 4.879h-2.927V9.778h2.927z"
          data-name="Path 9203"
        />
        <Path
          d="M8.29 24.415v6.834h6.831v-6.834zm4.879 4.88h-2.927v-2.928h2.927z"
          data-name="Path 9204"
        />
        <Path
          d="M24.879 7.826v6.831h6.833V7.826zm4.879 4.879H26.83V9.778h2.927z"
          data-name="Path 9205"
        />
        <Path
          d="M29.758 16.608v5.855h-4.879v1.951h6.833v-7.806z"
          data-name="Path 9206"
        />
        <Path
          d="M24.879 26.367v4.879h1.951v-2.928h2.927v2.927h1.955v-4.878z"
          data-name="Path 9207"
        />
        <Path
          d="M17.072 7.826v1.952h3.9v4.879h1.952V7.826z"
          data-name="Path 9208"
        />
        <Path
          d="M20.972 16.608v3.9h-3.9v5.855h3.9v4.879h1.952v-6.828h-3.9v-1.951h3.9v-3.9h1.952v1.945h1.951v-3.9z"
          data-name="Path 9209"
        />
        <Path
          d="M17.072 28.318h1.952v2.927h-1.952z"
          data-name="Rectangle 3346"
        />
        <Path
          d="M12.193 20.512h2.927v1.951h-2.927z"
          data-name="Rectangle 3347"
        />
        <Path
          d="M17.072 11.729v4.879H8.29v5.855h1.952v-3.9h8.782v-6.834z"
          data-name="Path 9210"
        />
      </G>
    </Svg>
  );
};

export default QRCodeBigIcon;
