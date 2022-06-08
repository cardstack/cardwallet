import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface RewardsIconProps extends SvgProps {
  pathFillColor: string;
}

const SvgComponent = (props: RewardsIconProps) => (
  <Svg width={30} height={21.672} viewBox="0 0 25 21.672" {...props}>
    <Path
      data-name="Union 52"
      d="M3.824 15.288A3.829 3.829 0 0 1 0 11.464V8.921a1.274 1.274 0 1 1 2.548 0v2.543a1.276 1.276 0 0 0 1.276 1.278h14.013a1.275 1.275 0 0 0 1.272-1.278v-7.64a1.277 1.277 0 0 0-1.272-1.276h-3.186a1.274 1.274 0 1 1 0-2.548h3.186a3.83 3.83 0 0 1 3.82 3.824v7.64a3.828 3.828 0 0 1-3.82 3.824z"
      transform="translate(3.342 5.152)"
      fill={props.pathFillColor || '#37eb77'}
    />
    <Path
      data-name="Path 8700"
      d="M-5497.739 15220.205h-8.867a.8.8 0 0 1-.76-.562l-1.847-5.908a.8.8 0 0 1 .235-.838.793.793 0 0 1 .858-.121l3.022 1.389 2.236-4.012a.8.8 0 0 1 .682-.406h.013a.8.8 0 0 1 .684.385l2.439 4.031 2.8-1.379a.787.787 0 0 1 .871.109.793.793 0 0 1 .241.842l-1.848 5.908a.8.8 0 0 1-.759.562zm-8.282-1.6h7.7l1.118-3.578-1.787.879a.8.8 0 0 1-1.034-.3l-2.108-3.486-1.93 3.463a.8.8 0 0 1-1.03.334l-2.062-.951z"
      transform="translate(5509.249 -15209.746)"
    />
    <Path
      data-name="Path 13236"
      d="m1.518 8.472-1.4-5.545 3.427 1.518L6.3-.041l2.729 4.486 3.36-1.517-2.081 5.757z"
      transform="translate(1.013 1.04)"
    />
  </Svg>
);

export default SvgComponent;
