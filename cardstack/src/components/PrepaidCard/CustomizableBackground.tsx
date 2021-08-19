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

const SMALL_PREPAID_CARD_GRADIENT_HEIGHT = 40;
const PREPAID_GRADIENT_HEIGHT = 110;

interface CardGradientProps {
  cardCustomization?: PrepaidCardCustomization;
  isEditing?: boolean;
  address: string;
  small?: boolean;
}

export const CustomizableBackground = ({
  cardCustomization,
  isEditing,
  address,
  small,
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

  const WIDTH = small ? '115%' : '100%';

  const HEIGHT = small
    ? SMALL_PREPAID_CARD_GRADIENT_HEIGHT
    : PREPAID_GRADIENT_HEIGHT;

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
            x2={WIDTH}
            y2="0"
            gradientTransform={`rotate(${angle}, ${width / 2}, ${HEIGHT / 2})`}
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
      <G transform="translate(0 71)">
        <Path
          d="M 0 164.992 v -0.127 H 0 V 0 H 139.563 s 13.162 0.132 24.094 12.362 s 15.768 15.605 15.768 15.605 s 7.3 8.09 22.43 8.452 H 411 l -0.064 128.572 Z"
          fill="#fff"
        />
      </G>
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
            : Number(viewBox[3]) || PREPAID_GRADIENT_HEIGHT;

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
