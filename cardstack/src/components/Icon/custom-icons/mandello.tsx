/* eslint-disable@typescript-eslint/ban-ts-comment */
import * as React from 'react';
import Svg, { SvgProps, G, Circle, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      //@ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 40}
      height={props.height || 40}
      viewBox="0 0 40 40"
    >
      <G transform="translate(19 -43)">
        <Circle
          data-name="Ellipse 1181"
          cx={20}
          cy={20}
          r={20}
          transform="translate(-19 43)"
          fill="red"
        />
        <Path
          data-name="Path 9094"
          d="M-11.848 64.096a.137.137 0 00.128-.08l.456-.768c.04-.064.064-.072.1-.072.048 0 .08.048.08.112v2.208c0 .128.048.184.176.184h1.02c.128 0 .176-.056.176-.184v-5.232c0-.128-.048-.184-.176-.184h-.648c-.184 0-.24.048-.344.216l-.848 1.36c-.04.064-.072.112-.128.112s-.088-.048-.128-.112l-.848-1.36c-.1-.168-.16-.216-.344-.216h-.648c-.128 0-.176.056-.176.184v5.232c0 .128.048.184.176.184h1.024c.128 0 .176-.056.176-.184v-2.208c0-.064.032-.112.08-.112.032 0 .064.016.1.072l.456.768a.152.152 0 00.14.08zm4.548-1.392c.024-.1.048-.168.112-.168s.1.064.12.168l.144.632a.712.712 0 01.024.152c0 .056-.048.088-.136.088h-.3c-.088 0-.144-.024-.144-.088a.712.712 0 01.024-.152zm-.356 2.276c.032-.144.1-.176.224-.176h.48c.128 0 .184.032.224.176l.12.488c.048.188.108.212.328.212h.992c.1 0 .144-.048.144-.128a.479.479 0 00-.016-.1l-1.32-5.188c-.04-.144-.1-.184-.232-.184h-.952c-.128 0-.192.04-.232.184l-1.32 5.192a.479.479 0 00-.016.1c0 .08.04.128.144.128h.988c.216 0 .28-.024.328-.216zm5.16.488a.3.3 0 00.344.212h.652c.128 0 .176-.056.176-.184v-5.232c0-.128-.048-.184-.176-.184h-1.02c-.128 0-.176.056-.176.184v1.608c0 .072-.032.112-.088.112s-.08-.04-.112-.136l-.592-1.552c-.072-.184-.16-.216-.344-.216h-.656c-.128 0-.176.056-.176.184v5.232c0 .128.048.184.176.184h1.024c.128 0 .176-.056.176-.184v-1.608c0-.072.032-.112.088-.112s.08.04.112.136zM.8 65.68c1.2 0 2.016-.68 2.016-2.8S2 60.08.8 60.08H-.344c-.128 0-.176.048-.176.176v5.248c0 .128.048.176.176.176zm.056-3.936c0-.128.072-.168.152-.168.184 0 .376.12.376 1.3s-.192 1.3-.376 1.3c-.08 0-.152-.04-.152-.168zm4.152 2.336c-.128 0-.176-.048-.176-.176v-.136c0-.128.048-.176.176-.176h.5c.128 0 .176-.056.176-.184v-1.056c0-.128-.048-.184-.176-.184h-.5c-.128 0-.176-.048-.176-.176v-.136c0-.128.048-.176.176-.176h.656c.128 0 .176-.056.176-.184v-1.232c0-.128-.048-.184-.176-.184H3.632c-.128 0-.176.056-.176.184v5.232c0 .128.048.184.176.184h2.032c.128 0 .176-.056.176-.184v-1.232c0-.128-.048-.184-.176-.184zm3.208-.072c-.128 0-.176-.048-.176-.176v-3.576c0-.128-.048-.176-.176-.176h-1.1c-.128 0-.176.048-.176.176v5.248c0 .128.048.176.176.176h2.072c.128 0 .176-.048.176-.176V64.18c0-.128-.048-.176-.176-.176zm3.064 0c-.128 0-.176-.048-.176-.176v-3.576c0-.128-.048-.176-.176-.176h-1.1c-.128 0-.176.048-.176.176v5.248c0 .128.048.176.176.176H11.9c.128 0 .176-.048.176-.176V64.18c0-.128-.048-.176-.176-.176zM14.232 60c-1.176 0-1.72.68-1.72 2.88s.544 2.88 1.72 2.88 1.72-.68 1.72-2.88-.544-2.88-1.72-2.88zm0 4.152c-.216 0-.3-.176-.3-1.272s.088-1.272.3-1.272.3.176.3 1.272-.084 1.272-.3 1.272z"
          fill="#fff"
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
