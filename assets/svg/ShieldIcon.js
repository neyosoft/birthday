import React from "react";
import Svg, { Path } from "react-native-svg";

export const ShieldIcon = (props) => (
    <Svg width={14} height={18} viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7 17.25c-4.5-2.005-6.75-4.005-6.75-6v-7.5c0-.576.22-.71.832-1.08.186-.112.407-.246.668-.42C1.871 2.17 4.422.75 7 .75c2.246 0 4.125.75 5.25 1.5.261.174.482.308.668.42.611.37.832.504.832 1.08.015.163.008 3.628.003 5.846l-.003 1.654c0 2-2.25 4-6.75 6zm5.25-6l.001-.934.003-1.465.003-1.269c.002-1.674.002-3.11 0-3.555l-.103-.064c-.242-.15-.559-.347-.736-.465C10.31 2.76 8.695 2.25 7 2.25c-1.621 0-3.729.788-4.418 1.248-.178.118-.494.315-.736.465l-.096.06v7.227c0 1.131 1.672 2.677 5.25 4.351 3.58-1.67 5.25-3.215 5.25-4.351zM9.47 6.22L6.25 9.44 4.53 7.72 3.47 8.78l2.78 2.78 4.28-4.28-1.06-1.06z"
            fill="#03E895"
        />
    </Svg>
);
