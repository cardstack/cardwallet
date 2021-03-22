import * as React from 'react';
import Svg, { SvgProps, G, Circle, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 24.108}
      height={props.height || 26.11}
      viewBox="0 0 40 40"
      {...props}
    >
      <G data-name="Group 11538" transform="translate(-58.092 64.315)">
        <Circle
          data-name="Ellipse 1115"
          cx={20}
          cy={20}
          r={20}
          transform="translate(58.092 -64.315)"
          fill="none"
        />
        <G data-name="Path 8447">
          <Path d="M67.937-37.462l-.036-.001h-.006a1.141 1.141 0 01-.99-.609 12.315 12.315 0 01-1.455-5.82c0-3.303 1.286-6.409 3.622-8.745a12.285 12.285 0 018.744-3.622h3.016l-.427-.426-.739-.739a1.195 1.195 0 01.002-1.603c.213-.218.51-.343.815-.343.306 0 .605.126.818.346l3.063 3.108.029.03.037.019c.011.005.031.03.047.05v.108l.073.073.026.026c.01.047.027.084.04.111a.438.438 0 00.047.177v.393a.293.293 0 00-.045.145.495.495 0 00-.033.08l-.054.08h-.025l-.06.164a.215.215 0 01-.086.107l-.023.015-.02.02-3.061 3.107c-.222.22-.52.343-.835.343h-.006a1.133 1.133 0 01-.793-.339 1.23 1.23 0 01-.004-1.648l.735-.688.46-.433h-2.997v.5-.5c-5.56 0-10.083 4.524-10.083 10.084.01 1.65.421 3.294 1.188 4.754a1.1 1.1 0 01-.49 1.513l-.017.009-.016.01a.813.813 0 01-.461.144z" />
          <Path
            d="M67.937-37.712a.564.564 0 00.32-.1l.032-.021.035-.017a.849.849 0 00.379-1.166l-.002-.003-.001-.003a10.66 10.66 0 01-1.217-4.87c0-5.698 4.635-10.334 10.333-10.334h3.63l-.922.865-.726.68a.98.98 0 00.005 1.302.886.886 0 00.615.261h.003a.932.932 0 00.66-.271l3.058-3.105.04-.04.036-.023.012-.034v-.028l.023-.034.08-.222h.047a.526.526 0 01.036-.115v-.28a.69.69 0 01-.042-.163.686.686 0 01-.018-.047l-.126-.126v-.092l-.042-.042-3.063-3.11a.896.896 0 00-.639-.27.897.897 0 00-.634.265.943.943 0 00-.002 1.259l.735.734.853.853H77.816c-3.236 0-6.279 1.26-8.567 3.55a12.037 12.037 0 00-3.549 8.568 12.066 12.066 0 001.426 5.702c.152.288.448.47.773.476H67.937m0 .5h-.047a1.391 1.391 0 01-1.206-.742 12.523 12.523 0 01-1.484-5.937c0-6.968 5.648-12.617 12.616-12.617h2.412l-.742-.742a1.438 1.438 0 010-1.948 1.391 1.391 0 011.994 0l3.062 3.108c.092.046.139.14.185.185v.093c.047.047.093.093.093.14 0 .046.046.092.046.139a.186.186 0 00.047.139v.556c-.047.047-.047.047-.047.093s-.046.093-.046.14l-.093.138c0 .047 0 .093-.046.093a.464.464 0 01-.186.232l-3.061 3.108a1.438 1.438 0 01-1.02.417 1.391 1.391 0 01-.974-.417 1.484 1.484 0 010-1.995l.742-.696h-2.366c-5.43 0-9.833 4.403-9.833 9.834.01 1.616.408 3.207 1.16 4.638a1.345 1.345 0 01-.603 1.855 1.067 1.067 0 01-.603.187z"
            fill={props.fill || '#03c4bf'}
          />
        </G>
        <G data-name="Path 8448">
          <Path d="M75.772-29.254h-.004a1.18 1.18 0 01-.837-.345l-3.059-3.105-.164-.164-.002-.024-.036-.054-.05-.076v-.063a.383.383 0 00-.047-.175v-.452a.298.298 0 00.046-.162v-.06a.415.415 0 00.047-.06h.018l.06-.166a.215.215 0 01.085-.106l.024-.016.02-.02 3.06-3.107c.215-.22.513-.347.82-.347.304 0 .601.125.815.343a1.23 1.23 0 01.003 1.648l-.734.688-.462.433H78.433c1.737 0 3.453-.454 4.963-1.313a10.054 10.054 0 003.666-3.597 10.052 10.052 0 001.407-4.968 10.052 10.052 0 00-1.248-5.008 1.187 1.187 0 01.461-1.568 1.14 1.14 0 011.557.46 12.389 12.389 0 011.502 6.146c-.041 2.14-.64 4.244-1.735 6.084a12.388 12.388 0 01-4.515 4.43 12.387 12.387 0 01-6.114 1.617h-2.973l.427.426.738.739c.412.45.411 1.153 0 1.603a1.134 1.134 0 01-.797.34z" />
          <Path
            d="M88.233-50.99a.894.894 0 00-.429.11.937.937 0 00-.362 1.233 10.302 10.302 0 011.277 5.129 10.303 10.303 0 01-1.443 5.092 10.305 10.305 0 01-3.756 3.686 10.304 10.304 0 01-5.086 1.346h-3.691l.923-.865.726-.68a.98.98 0 00-.007-1.303.897.897 0 00-.632-.264.898.898 0 00-.641.272l-3.062 3.108-.039.04-.037.023-.115.318h-.005a.543.543 0 01-.031.093v.338a.61.61 0 01.046.216l.01.014.064.098.107.106 3.059 3.105c.176.175.41.271.66.271h.002a.886.886 0 00.616-.262.943.943 0 00.001-1.258l-.734-.734-.853-.853H78.377c2.097 0 4.168-.548 5.99-1.585a12.137 12.137 0 004.424-4.34 12.137 12.137 0 001.7-5.96 12.14 12.14 0 00-1.473-6.024.897.897 0 00-.785-.47m0-.5a1.391 1.391 0 011.226.733 12.616 12.616 0 01-11.082 18.646h-2.369l.742.742c.507.55.507 1.397 0 1.948a1.392 1.392 0 01-.982.417c-.38 0-.743-.15-1.013-.417l-3.06-3.108-.186-.185a.14.14 0 01-.047-.093l-.093-.14v-.138c0-.047-.046-.093-.046-.14v-.556c0-.047.046-.047.046-.093v-.139c0-.046.093-.093.093-.14 0-.046 0-.092.047-.092a.464.464 0 01.185-.232l3.061-3.108a1.391 1.391 0 011.995 0 1.484 1.484 0 010 1.995l-.742.696H78.433A9.787 9.787 0 0087-49.412a1.438 1.438 0 01.557-1.902c.209-.116.442-.175.676-.175z"
            fill={props.fill || '#03c4bf'}
          />
        </G>
      </G>
    </Svg>
  );
}

export default SvgComponent;
