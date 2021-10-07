import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

export const StoryPlusIcon = (props) => (
    <Svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Rect x={1} y={1} width={14} height={14} rx={4} fill="#fff" />
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.625 7.375h3.125v1.25H8.625v3.125h-1.25V8.625H4.25v-1.25h3.125V4.25h1.25v3.125z"
            fill="#151515"
        />
        <Rect x={1} y={1} width={14} height={14} rx={4} stroke="#151515" strokeWidth={2} />
    </Svg>
);
