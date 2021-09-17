import React, { useEffect, useState } from 'react';
import SVG, {
  Defs,
  Stop,
  Rect,
  G,
  Path,
  SvgXml,
  LinearGradient,
} from 'react-native-svg';
import { PrepaidCardCustomization } from '@cardstack/types';
import { parseLinearGradient } from '@cardstack/utils';
import { useDimensions } from '@rainbow-me/hooks';

type CardVariants = 'normal' | 'small' | 'mini' | 'medium';

const cardType: Record<
  CardVariants,
  { width: string; height: number; bottomX?: number; bottomY?: number }
> = {
  normal: { width: '100%', height: 110, bottomX: 0, bottomY: 71 },
  medium: { width: '100%', height: 86, bottomX: -40, bottomY: 47 },
  small: { width: '115%', height: 40 },
  mini: { width: '100%', height: 14 },
};

const miniValues = {
  x2: 0.9,
  rotate: 20,
};

interface CardGradientProps {
  cardCustomization?: PrepaidCardCustomization;
  isEditing?: boolean;
  address: string;
  variant?: CardVariants;
}

export const CustomizableBackground = ({
  cardCustomization,
  isEditing,
  address,
  variant = 'normal',
}: CardGradientProps) => {
  const { width } = useDimensions();

  const patternUrl = cardCustomization?.patternUrl
    ? cardCustomization.patternUrl.startsWith('http')
      ? cardCustomization.patternUrl
      : `https://app.cardstack.com${cardCustomization.patternUrl}`
    : null;

  const { hasLinearGradient, angle, stop1, stop2 } = parseLinearGradient(
    cardCustomization
  );

  const WIDTH = cardType[variant].width;
  const HEIGHT = cardType[variant].height;

  const isMini = variant === 'mini';
  const x2 = isMini ? miniValues.x2 : WIDTH;
  const rotateWidth = isMini ? miniValues.rotate : width;

  return (
    <SVG
      width={WIDTH}
      height={HEIGHT}
      style={{ position: 'absolute' }}
      key={`svg_${address}_${isEditing}`}
    >
      {hasLinearGradient && (
        <Defs>
          <LinearGradient
            id="linearGradient"
            x1="0"
            y1="0"
            x2={x2}
            y2="0"
            gradientTransform={`rotate(${angle}, ${rotateWidth / 2}, ${
              HEIGHT / 2
            })`}
          >
            <Stop {...stop1} />
            <Stop {...stop2} />
          </LinearGradient>
        </Defs>
      )}
      <Rect
        id="Gradient"
        width={WIDTH}
        height={HEIGHT}
        fill={
          hasLinearGradient
            ? 'url(#linearGradient)'
            : cardCustomization?.background
        }
      />
      {patternUrl && (
        <PatternUri
          uri={patternUrl}
          patternColor={cardCustomization?.patternColor}
        />
      )}
      {isMini ? (
        <G transform="translate(-12.5 -25)">
          <Path
            data-name="White shape"
            d="M4.069 43.994L4 29.832h14.743a3.737 3.737 0 012.545 1.322 12.23 12.23 0 001.665 1.666 3.407 3.407 0 002.481.9h13.852l.067 10.271z"
            fill="#fff"
          />
        </G>
      ) : (
        <G
          transform={`translate(${cardType[variant].bottomX || 0} ${
            cardType[variant].bottomY || 71
          })`}
        >
          <Path
            d="M 0 164.992 v -0.127 H 0 V 0 H 139.563 s 13.162 0.132 24.094 12.362 s 15.768 15.605 15.768 15.605 s 7.3 8.09 22.43 8.452 H 411 l -0.064 128.572 Z"
            fill="#fff"
          />
        </G>
      )}
    </SVG>
  );
};

const PatternUri = ({
  uri,
  patternColor,
}: {
  uri: string;
  patternColor?: string;
}) => {
  const { width: screenWidth } = useDimensions();

  const [patternObj, setPattern] = useState<{
    pattern: string;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!uri || !screenWidth) return;

    async function getPattern() {
      try {
        const response = await (
          await fetch(
            uri.startsWith('http') ? uri : `https://app.cardstack.com${uri}`
          )
        ).text();

        const viewBox = response
          ? (/viewBox="([^"]+)"/.exec(response) || '')[1].trim().split(' ')
          : [];

        // mapping svg pattern width
        const width =
          screenWidth > Number(viewBox[2])
            ? screenWidth
            : Number(viewBox[2]) || screenWidth;

        // mapping svg pattern height filling width but keeping ratio
        const height =
          screenWidth > Number(viewBox[2])
            ? (screenWidth / Number(viewBox[2])) * Number(viewBox[3])
            : Number(viewBox[3]) || cardType.normal.height;

        setPattern({
          pattern: response,
          width,
          height,
        });
      } catch {
        return;
      }
    }

    getPattern();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return patternObj && patternObj.pattern ? (
    <SvgXml
      xml={patternObj.pattern}
      fill={patternColor}
      x="0"
      y="0"
      width={patternObj.width}
      height={patternObj.height}
    />
  ) : null;
};
