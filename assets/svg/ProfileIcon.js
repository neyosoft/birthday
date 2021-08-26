import React from "react";
import Svg, { Path } from "react-native-svg";

export const ProfileIcon = (props) => (
    <Svg width={16} height={20} viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path
            clipRule="evenodd"
            d="M6.87 17.052c-3.076 0-5.703-.48-5.703-2.396 0-1.918 2.61-3.688 5.703-3.688 3.077 0 5.704 1.753 5.704 3.67s-2.61 2.414-5.704 2.414zM6.864 8.311a3.655 3.655 0 10-3.656-3.655 3.642 3.642 0 003.63 3.655h.026z"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke={props.color || "#03E895"}
        />
    </Svg>
);
