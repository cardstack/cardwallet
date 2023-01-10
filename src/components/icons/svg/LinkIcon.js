import React from 'react';
import { G, Path } from 'react-native-svg';

import Svg from '../Svg';

// @ts-ignore
const LinkIcon = props => (
  <Svg
    height={39}
    viewBox="0 0 40 39"
    width={40}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G data-name="Group 12650">
      <G data-name="Group 12648">
        <Path
          d="M12.093 39V27.858H0V12.073h12.093V0h15.815v12.073H40v15.785H27.908V39z"
          data-name="Union 19"
          fill={props.fill || '#F8F7FA'}
        />
      </G>
      <G
        data-name="icon_Link (stroke)"
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <Path
          d="M18 20.5a5 5 0 007.54.54l3-3a5 5 0 10-7.071-7.071L19.75 12.68"
          data-name="Path 7554"
        />
        <Path
          d="M22 18.5a5 5 0 00-7.54-.54l-3 3a5 5 0 107.071 7.071l1.709-1.711"
          data-name="Path 7555"
        />
      </G>
    </G>
  </Svg>
);

export default LinkIcon;
