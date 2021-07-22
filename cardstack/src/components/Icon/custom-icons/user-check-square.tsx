import * as React from 'react';
import Svg, { SvgProps, Defs, ClipPath, Path, G, Rect } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      //@ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      width={59.642}
      height={50}
      viewBox="0 0 59.642 50"
    >
      <Defs>
        <ClipPath id="prefix__a">
          <Path
            data-name="Union 2"
            d="M0 56.9V0h22.414v13.793h12.069v8.62H50V56.9z"
            fill="#fff"
            stroke="#03c4bf"
          />
        </ClipPath>
      </Defs>
      <G data-name="icon_ID Verification">
        <G data-name="Group 882">
          <G data-name="Group 881">
            <G
              data-name="Mask Group 11"
              clipPath="url(#prefix__a)"
              transform="rotate(90 28.448 28.448)"
            >
              <G data-name="Group 918">
                <G
                  data-name="Rectangle X"
                  transform="rotate(-90 25.432 17.672)"
                  fill="none"
                  stroke="#03c4bf"
                  strokeWidth={3}
                >
                  <Rect width={37.93} height={31.034} rx={4} stroke="none" />
                  <Rect
                    x={-1.5}
                    y={-1.5}
                    width={40.93}
                    height={34.034}
                    rx={5.5}
                  />
                </G>
              </G>
            </G>
            <G fill="none" strokeLinecap="round">
              <Path
                data-name="Path 5806"
                d="M24.136 31.524v-1.931a4.13 4.13 0 014.354-3.862h8.707a3.859 3.859 0 012.235.547 6.01 6.01 0 011.738 1.696"
                stroke="#03c4bf"
                strokeLinejoin="round"
                strokeWidth={3}
              />
              <G data-name="Ellipse 100">
                <Path d="M32.966 15.196a4.31 4.31 0 104.312 4.31 4.311 4.311 0 00-4.312-4.31z" />
                <Path
                  d="M32.966 15.196a4.31 4.31 0 100 8.621 4.31 4.31 0 000-8.621m0-3c4.032 0 7.312 3.279 7.312 7.31 0 4.03-3.28 7.31-7.312 7.31-4.031 0-7.311-3.28-7.311-7.31 0-4.031 3.28-7.31 7.311-7.31z"
                  fill="#03c4bf"
                />
              </G>
            </G>
          </G>
        </G>
        <Path
          data-name="Path 178"
          d="M57.521 29.939L47.174 40.284l-4.7-4.703"
          fill="none"
          stroke="#03c4bf"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
        />
        <Path
          data-name="Path 5819"
          d="M51.744 22.307a1.477 1.477 0 101.477-1.479 1.477 1.477 0 00-1.477 1.479z"
          fill="#03c4bf"
        />
        <Path
          data-name="Path 5820"
          d="M33 40.301a1.495 1.495 0 101.495-1.495A1.495 1.495 0 0033 40.301z"
          fill="#03c4bf"
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
