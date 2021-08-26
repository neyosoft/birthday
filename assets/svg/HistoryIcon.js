import React from "react";
import Svg, { Path } from "react-native-svg";

export const HistoryIcon = (props) => (
    <Svg width={20} height={20} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path
            d="M5.236 7.55v5.579M9.03 4.881v8.248M12.763 10.498v2.631"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke={props.color || "#03E895"}
        />
        <Path
            clipRule="evenodd"
            d="M.917 9.03C.917 2.947 2.946.918 9.03.918c6.085 0 8.114 2.029 8.114 8.114 0 6.085-2.03 8.114-8.114 8.114-6.085 0-8.114-2.03-8.114-8.114z"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke={props.color || "#03E895"}
        />
    </Svg>
);
