import axios from "axios";
import { Camera } from "expo-camera";
import { useToast } from "react-native-fast-toast";
import React, { useRef, useState, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";

import Config from "../../config";
import { theme } from "../../theme";
import { useAuth } from "../../context";
import { AppText, RecordBtn } from "../../components";
import { CameraFlip } from "../../../assets/svg";
import { extractImageData } from "../../utils/file.utils";
import { extractResponseErrorMessage } from "../../utils/request.utils";

const { width } = Dimensions.get("window");

export const ThankYouVideo = ({ navigation }) => {
    const cameraRef = useRef();
    const timerRef = useRef();
    const toast = useToast();
    const { user, accessToken } = useAuth();

    const [timeLeft, setTimeLeft] = useState(10);

    const [recording, setRecording] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.front);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const flipCamera = () => {
        setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
    };

    const startTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            if (timeLeft <= 0) {
                clearTimeout(timerRef.current);
            } else {
                setTimeLeft(value => value - 1);
            }
        }, 1000);
    };

    const startRecording = async () => {
        if (recording) {
            setRecording(false);
            clearInterval(timerRef.current);
            await cameraRef?.current?.stopRecording();

            return;
        }

        setRecording(true);
        startTimer();

        try {
            const videoPath = await cameraRef?.current?.recordAsync({ maxDuration: 10 });

            const now = new Date();

            const formdata = new FormData();
            formdata.append("mediaFile", extractImageData(videoPath.uri));

            await axios.post(
                `${Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL}/media/upload/${
                    user.id
                }/IMAGE`,
                formdata,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${accessToken}`,
                        TimeStamp: `${now.getFullYear()}-${
                            now.getMonth() + 1
                        }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`,
                    },
                },
            );

            toast.show("Image successfully uploaded.");

            navigation.navigate("Dashboard");
        } catch (error) {
            toast.show(extractResponseErrorMessage(error));
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

                {recording ? <AppText style={styles.timeleft}>{timeLeft}</AppText> : null}

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
        height: (width / 3) * 4,
    },
    camera: {
        width,
        flex: 1,
        height: "70%",
    },
    buttonContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    timeleft: {
        marginTop: 5,
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
