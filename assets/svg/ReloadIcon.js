import React from "react";
import Svg, { Path } from "react-native-svg";

export const ReloadIcon = (props) => (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 2.333c1.995 0 3.705.9 4.84 2.5h-3.173V6.5H16.5V.667h-1.667v2.725C13.396 1.652 11.337.667 9 .667A8.333 8.333 0 00.667 9h1.666A6.667 6.667 0 019 2.333zm0 13.334c-1.995 0-3.705-.9-4.84-2.5h3.173V11.5H1.5v5.833h1.667v-2.725c1.437 1.74 3.496 2.725 5.833 2.725A8.333 8.333 0 0017.333 9h-1.666A6.667 6.667 0 019 15.667z"
            fill="#BEBEBE"
        />
    </Svg>
);
