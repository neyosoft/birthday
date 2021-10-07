import React from "react";
import Svg, { Path } from "react-native-svg";

export const AudioIcon = (props) => (
    <Svg width={10} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.925.577a2.308 2.308 0 012.308 2.308v4.04a2.308 2.308 0 01-4.616 0v-4.04A2.308 2.308 0 014.925.577zm.577 10.929v.613h1.731v1.154H2.617v-1.154h1.73v-.613a4.617 4.617 0 01-4.039-4.58V5.77h1.155v1.154a3.463 3.463 0 106.925 0V5.771h1.154v1.154a4.617 4.617 0 01-4.04 4.581zm-1.731-8.62a1.154 1.154 0 012.308 0v4.04a1.154 1.154 0 01-2.308 0v-4.04z"
            fill="#A696FB"
        />
    </Svg>
);
