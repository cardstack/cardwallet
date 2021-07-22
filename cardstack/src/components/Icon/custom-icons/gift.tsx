import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line@typescript-eslint/ban-ts-comment
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={24.527}
      height={25.025}
      viewBox="0 0 24.527 25.025"
      {...props}
    >
      <Path
        data-name="Path 8442"
        d="M23.744 5.648h-6.791a6.564 6.564 0 002.541-2.247 2.477 2.477 0 00.31-2.587 1.808 1.808 0 00-1.835-.783c-2.47.193-4.648 2.8-5.705 4.3-1.058-1.5-3.235-4.1-5.705-4.3a1.806 1.806 0 00-1.835.783 2.477 2.477 0 00.31 2.587 6.564 6.564 0 002.541 2.247H.783A.783.783 0 000 6.431v4.54a.783.783 0 00.783.783h.184v12.49a.783.783 0 00.783.783h21.03a.783.783 0 00.783-.783V11.755h.182a.783.783 0 00.783-.783v-4.54a.783.783 0 00-.783-.784zM13.7 7.213v2.975h-2.873V7.213zm9.261 2.975h-7.7V7.213h7.7zm-4.869-8.6h.117a.566.566 0 01.256.041c.039.068.036.426-.319.977a5.868 5.868 0 01-4.43 2.379c1.044-1.416 2.754-3.261 4.375-3.391zM6.38 2.603c-.355-.552-.357-.91-.324-.972a.518.518 0 01.261-.046 1.031 1.031 0 01.116 0c1.621.128 3.332 1.975 4.375 3.392a5.868 5.868 0 01-4.429-2.379zM1.565 7.214h7.7v2.975h-7.7zm.966 4.682h6.732v11.563H2.532zm8.3 11.565V11.895H13.7v11.564zm11.168 0h-6.734V11.895H22z"
      />
    </Svg>
  );
}

export default SvgComponent;
