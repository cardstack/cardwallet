import React from 'react';
import Svg, { Defs, ClipPath, Path, Rect, Mask } from 'react-native-svg';

import { colors } from '@cardstack/theme';
import { screenHeight, screenWidth } from '@cardstack/utils';

const halfScreen = screenWidth / 2;

const fullScreenSizeProps = {
  height: '100%',
  width: '100%',
};

const aspectRatio = screenHeight / screenWidth;

// CrossHair
export const CROSSHAIR_SIZE = screenWidth * 0.68;

export const crosshair = {
  radius: CROSSHAIR_SIZE * 0.1,
  position: {
    x: halfScreen - CROSSHAIR_SIZE / 2,
    y: screenHeight * aspectRatio * 0.085,
  },
  stroke: { color: colors.teal, width: 5 },
};

// HollowSquare
const HOLLOW_SQUARE_SIZE = CROSSHAIR_SIZE * 0.94;

const hollowSquare = {
  radius: HOLLOW_SQUARE_SIZE * 0.09,
  position: {
    x: halfScreen - HOLLOW_SQUARE_SIZE / 2,
    y: crosshair.position.y + 8,
  },
};

// Path Clip Drawing
const LINE_SIZE = CROSSHAIR_SIZE / 5.5;

const path = {
  position: {
    x: screenWidth - crosshair.position.x,
    y: crosshair.position.y + CROSSHAIR_SIZE,
  },
  distance: CROSSHAIR_SIZE - LINE_SIZE / 2,
  drawSquare: `h-${LINE_SIZE}v-${LINE_SIZE}h${LINE_SIZE}v${LINE_SIZE}z`,
  translate: 12,
};

export const QRCodeOverlay = () => (
  <Svg {...fullScreenSizeProps}>
    <Defs>
      <ClipPath id="a">
        <Path
          d={`m${path.position.x} ${path.position.y}${path.drawSquare}m-${path.distance} 0${path.drawSquare}m${path.distance}-${path.distance}${path.drawSquare}m-${path.distance} 0${path.drawSquare}`}
          translate={path.translate}
        />
      </ClipPath>
      <Mask id="mask" x="0" y="0" {...fullScreenSizeProps}>
        <Rect {...fullScreenSizeProps} fill="white" />
        <Rect
          x={hollowSquare.position.x}
          y={hollowSquare.position.y}
          rx={hollowSquare.radius}
          width={HOLLOW_SQUARE_SIZE}
          height={HOLLOW_SQUARE_SIZE}
          fill="black"
        />
      </Mask>
    </Defs>
    <Rect
      {...fullScreenSizeProps}
      mask="url(#mask)"
      fill="#272330"
      stroke="black"
      opacity={0.8}
    />
    <Rect
      clipPath="url(#a)"
      x={crosshair.position.x}
      y={crosshair.position.y}
      width={CROSSHAIR_SIZE}
      height={CROSSHAIR_SIZE}
      rx={crosshair.radius}
      fill="none"
      stroke={crosshair.stroke.color}
      strokeWidth={crosshair.stroke.width}
    />
  </Svg>
);
