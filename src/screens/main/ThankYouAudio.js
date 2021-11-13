import axios from "axios";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "react-native-fast-toast";
import React, { useRef, useState, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, View, TouchableOpacity, Dimensions, StatusBar, ActivityIndicator } from "react-native";

import Config from "../../config";
import { theme } from "../../theme";
import { useAuth } from "../../context";
import { AppText, RecordBtn } from "../../components";
import { extractImageData } from "../../utils/file.utils";
import { extractResponseErrorMessage } from "../../utils/request.utils";

const { width } = Dimensions.get("window");

export const ThankYouAudio = ({ navigation }) => {
    const timerRef = useRef();
    const recordRef = useRef();

    const toast = useToast();
    const { user, accessToken } = useAuth();

    const [timeLeft, setTimeLeft] = useState(10);

    const [recording, setRecording] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        (async () => {
            const permissionResponse = await Audio.requestPermissionsAsync();

            setHasPermission(permissionResponse.status === "granted");
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
                setTimeLeft(value => {
                    console.log(value);
                    if (value <= 0) {
                        clearTimeout(timerRef.current);
                        stopRecording();

                        return 0;
                    } else {
                        return value - 1;
                    }
                });
            }
        }, 1000);
    };

    const startRecording = async () => {
        if (recordRef.current) {
            recordRef.current._cleanupForUnloadedRecorder({ durationMillis: 0 });
            recordRef.current = undefined;
        }

        try {
            const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            recordRef.current = recording;

            setRecording(true);
            startTimer();
        } catch (error) {
            console.log("can't start recording: ", error);
            toast.show(extractResponseErrorMessage(error));
        }
    };

    const stopRecording = async () => {
        console.log("we have stop recording...");
        setRecording(false);

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        if (!recordRef.current) return;

        setUploading(true);

        try {
            await recordRef.current.stopAndUnloadAsync();
            const uri = recordRef.current.getURI();

            recordRef.current = undefined;

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

            toast.show("Audio successfully uploaded.");

            navigation.navigate("Dashboard");
        } catch (error) {
            console.log("the error: ", error);
            setUploading(false);

            if (error?.code === "E_AUDIO_NODATA") {
                return toast.show(`Stop was called too quickly, no data has yet been received (${error.message})`);
            }

            toast.show(extractResponseErrorMessage(error));
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.audioViewContainer}>
                <Ionicons name="mic" size={RFPercentage(20)} color="#fff" />
            </View>
            <View style={styles.buttonContainer}>
                {uploading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#03E895" />
                        <AppText style={styles.loadingText}>Uploading media file...</AppText>
                    </View>
                ) : (
                    <>
                        <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
                            <RecordBtn recording={recording} />
                        </TouchableOpacity>

                        {recording ? <AppText style={styles.timeleft}>{timeLeft}</AppText> : null}
                    </>
                )}
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
    loadingContainer: {
        alignItems: "center",
    },
    loadingText: {
        color: "#fff",
        marginTop: RFPercentage(1),
    },
});
