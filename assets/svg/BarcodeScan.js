import React from "react";
import Svg, { Path } from "react-native-svg";

export const BarcodeScan = (props) => (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M26.667 3.333h6.97c1.673 0 3.03 1.493 3.03 3.334v6.666h-3.334V6.667h-6.666V3.333zM6.364 36.667h6.97v-3.334H6.666v-6.666H3.333v6.666c0 1.841 1.357 3.334 3.03 3.334zm20.303-3.334v3.334h6.97c1.673 0 3.03-1.493 3.03-3.334v-6.666h-3.334v6.666h-6.666zM13.333 6.667V3.333h-6.97c-1.673 0-3.03 1.493-3.03 3.334v6.666h3.334V6.667h6.666z"
            fill="#fff"
        />
        <Path
            d="M13.333 23.333c0 1.667 1.667 5 6.667 5s6.667-3.333 6.667-5M19.995 11.667s0 6.666.005 8.333c0 .833-.833 1.667-1.667 1.667h-1.178"
            stroke="#fff"
            strokeWidth={2}
            strokeLinejoin="round"
        />
        <Path fill="#fff" d="M25 11.667h3.333v5H25zM11.667 11.667H15v5h-3.333z" />
    </Svg>
);
