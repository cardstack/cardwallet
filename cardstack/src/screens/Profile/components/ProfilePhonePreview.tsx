import * as React from 'react';
import { ImageSourcePropType } from 'react-native';
import Svg, {
  Defs,
  ClipPath,
  Path,
  G,
  Image,
  Text,
  TSpan,
} from 'react-native-svg';

import { phoneImageBase64 } from './phoneImageBase64';

interface Props {
  profileUrl: string;
  profileName?: string;
  profileColor?: string;
}

const ProfilePhonePreview = ({
  profileName = 'Profile Name',
  profileUrl = 'mandello123.card.xyz',
  profileColor = '#0069f9',
}: Props) => (
  <Svg width="100%" height="100%" viewBox="0 0 336 300">
    <Defs>
      <ClipPath id="a">
        <Path
          data-name="Rectangle 3994"
          transform="translate(20 150)"
          fill="#0069f9"
          stroke="#707070"
          d="M0 0h336v300H0z"
        />
      </ClipPath>
    </Defs>
    <G transform="translate(-20 -150)" clipPath="url(#a)">
      <G transform="translate(20 150)">
        <Image
          width={230}
          height={461.38}
          // @ts-expect-error property exists
          transform="translate(52.5 41.31)"
          xlinkHref={phoneImageBase64 as ImageSourcePropType}
        />
      </G>
      <Path fill={profileColor} d="M147 302h81v45h-81z" />
      <Path fill="#dedee0" d="M111 232h154v16H111z" />
      <Text
        transform="translate(188 243)"
        fill="#000"
        fontSize={8.5}
        fontFamily="Helvetica"
        letterSpacing="-.031em"
      >
        <TSpan x={-38.839} y={0}>
          {profileUrl}
        </TSpan>
      </Text>
      <Text
        transform="translate(188 334)"
        fill="#fff"
        fontSize={7}
        fontFamily="OpenSans-Bold, Open Sans"
        fontWeight={700}
      >
        <TSpan x={-37.796} y={0}>
          {profileUrl}
        </TSpan>
      </Text>
      <Text
        transform="translate(188 320)"
        fill="#fff"
        fontSize={12.4}
        fontFamily="OpenSans-Bold, Open Sans"
        fontWeight={700}
      >
        <TSpan x={-39.734} y={0}>
          {profileName}
        </TSpan>
      </Text>
    </G>
  </Svg>
);

export default ProfilePhonePreview;
