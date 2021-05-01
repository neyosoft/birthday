import React from "react";
import Svg, { Path } from "react-native-svg";

export const UserAvatarIcon = (props) => (
    <Svg width={16} height={20} viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <Path
            d="M7.997 13.175c-4.313 0-7.997.68-7.997 3.4C0 19.295 3.66 20 7.997 20c4.313 0 7.997-.68 7.997-3.4 0-2.721-3.66-3.425-7.997-3.425z"
            fill={props.color || "#03E895"}
        />
        <Path
            opacity={0.4}
            d="M7.997 10.584a5.273 5.273 0 005.292-5.292A5.273 5.273 0 007.997 0a5.274 5.274 0 00-5.292 5.292 5.274 5.274 0 005.292 5.292z"
            fill={props.color || "#03E895"}
        />
    </Svg>
);
