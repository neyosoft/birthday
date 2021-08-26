import React from "react";
import Svg, { Path } from "react-native-svg";

export const WithdrawIcon = (props) => (
    <Svg width={15} height={14} viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path
            d="M13.305 8.784h-2.591a1.709 1.709 0 010-3.418h2.57M11.005 7.035h-.198M4.261 4.43h2.707"
            stroke="#fff"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            clipRule="evenodd"
            d="M1 7.169c0-4.27 1.55-5.693 6.2-5.693S13.4 2.9 13.4 7.17c0 4.269-1.55 5.692-6.2 5.692S1 11.438 1 7.17z"
            stroke="#fff"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);
