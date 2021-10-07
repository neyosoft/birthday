import React from "react";
import Svg, { Path } from "react-native-svg";

export const VideoIcon = (props) => (
    <Svg width={12} height={10} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path
            opacity={0.4}
            d="M11.383 2.371a.798.798 0 00-.792-.037l-.855.432a.934.934 0 00-.512.84v3.365c0 .359.196.68.512.841l.854.431a.791.791 0 00.793-.036.824.824 0 00.386-.703v-4.43a.826.826 0 00-.386-.703z"
            fill="#FEC65A"
        />
        <Path
            d="M5.945 9.616H2.604C1.206 9.616.23 8.652.23 7.273V3.305c0-1.38.975-2.343 2.373-2.343h3.341c1.398 0 2.373.963 2.373 2.343v3.968c0 1.38-.975 2.343-2.373 2.343z"
            fill="#FEC65A"
        />
    </Svg>
);
