import React from "react";
import Svg, { Path } from "react-native-svg";

export const Fingerprint = (props) => (
    <Svg width={40} height={40} viewBox="0 0 40 40" {...props}>
        <Path
            d="M20 5C12.636 5 6.667 10.97 6.667 18.333v10.834a1.667 1.667 0 01-3.334 0V18.333C3.333 9.13 10.795 1.667 20 1.667c9.205 0 16.667 7.462 16.667 16.666v10.834a1.667 1.667 0 01-3.334 0V18.333C33.333 10.97 27.363 5 20 5zm0 5a8.333 8.333 0 00-8.333 8.333v15a1.667 1.667 0 11-3.334 0v-15C8.333 11.89 13.557 6.667 20 6.667s11.667 5.223 11.667 11.666v15a1.667 1.667 0 11-3.334 0v-15A8.333 8.333 0 0020 10zm0 5a3.333 3.333 0 00-3.333 3.333v17.5a1.667 1.667 0 11-3.334 0v-17.5a6.667 6.667 0 0113.334 0v17.5a1.667 1.667 0 11-3.334 0v-17.5A3.333 3.333 0 0020 15zm0 1.563c.92 0 1.667.746 1.667 1.666v2.292a1.667 1.667 0 11-3.334 0v-2.292c0-.92.747-1.666 1.667-1.666zm0 7.604c.92 0 1.667.746 1.667 1.666v10.834a1.667 1.667 0 01-3.334 0V25.833c0-.92.747-1.666 1.667-1.666z"
            fill="#03E895"
        />
    </Svg>
);
