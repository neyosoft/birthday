// import React, { useRef, useState, useEffect } from "react";
// import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
// import { useIsFocused } from "@react-navigation/core";
// import { Camera } from "expo-camera";

// import { theme } from "../../theme";
// import { useAuth } from "../../context";
// import { AppText } from "../../components";

// import { RFPercentage } from "react-native-responsive-fontsize";

// export const ThankYouVideo = ({ navigation }) => {
//     const cameraRef = useRef();
//     const isFocused = useIsFocused();

//     const [hasPermission, setHasPermission] = useState(null);
//     const [type, setType] = useState(Camera.Constants.Type.back);

//     useEffect(() => {
//         (async () => {
//             const { status } = await Camera.requestPermissionsAsync();
//             setHasPermission(status === "granted");
//         })();
//     }, []);

//     const startRecording = async () => {
//         try {
//             const videoPath = await cameraRef?.current?.recordAsync();

//             console.log("videoPath: ", videoPath);
//         } catch (error) {
//             console.log("Something went wrong: ", error);
//         }
//     };

//     if (hasPermission === null) {
//         return <View />;
//     }
//     if (hasPermission === false) {
//         return <Text>No access to camera</Text>;
//     }

//     return (
//         <View style={styles.container}>
//             <Camera style={styles.camera} type={type}>
//                 <View style={styles.buttonContainer}>
//                     <TouchableOpacity
//                         style={styles.button}
//                         onPress={() => {
//                             setType(
//                                 type === Camera.Constants.Type.back
//                                     ? Camera.Constants.Type.front
//                                     : Camera.Constants.Type.back,
//                             );
//                         }}>
//                         <Text style={styles.text}> Flip </Text>
//                     </TouchableOpacity>
//                 </View>
//             </Camera>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         paddingTop: 20,
//         backgroundColor: "#fff",
//         // backgroundColor: theme.backgroundColor,
//     },
//     backBtnArea: {
//         padding: 25,
//         paddingBottom: 20,
//         flexDirection: "row",
//     },
//     camera: {
//         flex: 1,
//         justifyContent: "flex-end",
//     },
//     actionableBox: {
//         alignItems: "center",
//         margin: RFPercentage(2),
//     },
//     recordBtn: {
//         borderRadius: 10,
//         paddingVertical: RFPercentage(1),
//         paddingHorizontal: RFPercentage(4),
//         backgroundColor: theme.color.primary,
//     },
//     btnText: {
//         color: "#fff",
//         fontSize: RFPercentage(1.8),
//     },
//     camera: {
//         flex: 1,
//     },
//     buttonContainer: {
//         flex: 1,
//         backgroundColor: "transparent",
//         flexDirection: "row",
//         margin: 20,
//     },
//     button: {
//         flex: 0.1,
//         alignSelf: "flex-end",
//         alignItems: "center",
//     },
//     text: {
//         fontSize: 18,
//         color: "white",
//     },
// });

import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";

export const ThankYouVideo = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back,
                            );
                        }}>
                        <Text style={styles.text}> Hello </Text>
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "red",
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "row",
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: "flex-end",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        color: "white",
    },
});
