import React from "react";
import Svg, { Path } from "react-native-svg";

export const HomeIcon = (props) => (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path
            d="M7.566 13.446h4.845"
            stroke={props.color || "#03E895"}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            clipRule="evenodd"
            d="M2 11.428c0-4.693.512-4.366 3.266-6.92 1.205-.97 3.08-2.841 4.699-2.841 1.618 0 3.53 1.862 4.747 2.841 2.754 2.554 3.265 2.227 3.265 6.92 0 6.905-1.633 6.905-7.989 6.905-6.355 0-7.988 0-7.988-6.905z"
            stroke={props.color || "#03E895"}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);
