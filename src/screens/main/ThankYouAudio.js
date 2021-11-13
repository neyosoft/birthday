import axios from "axios";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "react-native-fast-toast";
import React, { useRef, useState, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, View, TouchableOpacity, Dimensions, StatusBar } from "react-native";

import Config from "../../config";
import { theme } from "../../theme";
import { useAuth } from "../../context";
import { AppText, RecordBtn } from "../../components";
import { extractImageData } from "../../utils/file.utils";
import { extractResponseErrorMessage } from "../../utils/request.utils";

const { width } = Dimensions.get("window");

export const ThankYouAudio = ({ navigation }) => {
    const timerRef = useRef();
    const toast = useToast();
    const { user, accessToken } = useAuth();

    const [timeLeft, setTimeLeft] = useState(60);

    const [recording, setRecording] = useState(false);
    const [recordHandle, setRecordHandle] = useState(null);

    useEffect(() => {
        (async () => {
            const permissionResponse = await Audio.requestPermissionsAsync();

            console.log("permissionResponse: ", permissionResponse);
        })();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

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
        setRecording(true);
        startTimer();

        try {
            const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);

            setRecordHandle(recording);
        } catch (error) {
            toast.show(extractResponseErrorMessage(error));
        }
    };

    const stopRecording = async () => {
        await recordHandle.stopAndUnloadAsync();
        const uri = recordHandle.getURI();

        console.log("uri: ", uri);

        const now = new Date();

        const formdata = new FormData();
        formdata.append("mediaFile", extractImageData(uri));

        await axios.post(
            `${Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL}/media/upload/${
                user.id
            }/AUDIO`,
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
    };

    return (
        <View style={styles.container}>
            <View style={styles.audioViewContainer}>
                <Ionicons name="mic" size={RFPercentage(20)} color="#fff" />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
                    <RecordBtn recording={recording} />
                </TouchableOpacity>

                {recording ? <AppText style={styles.timeleft}>{timeLeft}</AppText> : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: theme.backgroundColor,
    },
    audioViewContainer: {
        width,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "gray",
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
