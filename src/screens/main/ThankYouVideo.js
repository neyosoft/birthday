import { Camera } from "expo-camera";
import { useToast } from "react-native-fast-toast";
import React, { useRef, useState, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";

import { theme } from "../../theme";
import { RecordBtn } from "../../components";
import { CameraFlip } from "../../../assets/svg";

const { width } = Dimensions.get("window");

export const ThankYouVideo = ({ navigation }) => {
    const cameraRef = useRef();
    const toast = useToast();

    const [recording, setRecording] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.front);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    const flipCamera = () => {
        setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
    };

    const startRecording = async () => {
        if (recording) {
            setRecording(false);
            await cameraRef?.current?.stopRecording();

            return;
        }

        setRecording(true);

        try {
            const videoPath = await cameraRef?.current?.recordAsync({ maxDuration: 60 });

            console.log("videoPath: ", videoPath);
        } catch (error) {
            toast.show("There is problem recording video");
        }
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.cameraArea}>
                <Camera ref={cameraRef} style={styles.camera} type={type} />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={startRecording}>
                    <RecordBtn recording={recording} />
                </TouchableOpacity>
                <View style={styles.flipArea}>
                    <TouchableOpacity onPress={flipCamera}>
                        <CameraFlip height={40} width={40} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    },
    cameraArea: {
        width,
        height: width * 1.6,
        backgroundColor: "red",
    },
    camera: {
        width,
        flex: 1,
        height: "70%",
    },
    buttonContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    flipArea: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: RFPercentage(3),
        flexDirection: "column",
        justifyContent: "center",
    },
});
