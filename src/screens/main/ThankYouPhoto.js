import axios from "axios";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "react-native-fast-toast";
import React, { useRef, useState, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";

import Config from "../../config";
import { theme } from "../../theme";
import { CameraFlip } from "../../../assets/svg";
import { AppText, CapturePhotoBtn } from "../../components";
import { useAuth } from "../../context";
import { extractImageData } from "../../utils/file.utils";
import { debugAxiosError } from "../../utils/request.utils";

const { width } = Dimensions.get("window");

export const ThankYouPhoto = ({ navigation }) => {
    const cameraRef = useRef();
    const toast = useToast();

    const { user, accessToken, authenticatedRequest } = useAuth();

    const [preview, setPreview] = useState(false);
    const [photoData, setPhotoData] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraIsReady, setCameraIsReady] = useState(false);
    const [type, setType] = useState(() => Camera.Constants.Type.back);

    console.log({ type });

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    const flipCamera = () => {
        setType(value =>
            value === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back,
        );
    };

    const takePhoto = async () => {
        try {
            setPreview(true);

            const photoPath = await cameraRef?.current?.takePictureAsync({ base64: false, exif: false, quality: 0.7 });

            await cameraRef?.current?.pausePreview();

            setPhotoData(photoPath);

            console.log({ photoPath });
        } catch (error) {
            toast.show("There is problem taking photo");
        }
    };

    const uploadPhoto = async () => {
        if (!photoData) return;

        setUploading(true);

        console.log(extractImageData(photoData.uri));

        const formdata = new FormData();
        formdata.append("mediaFile", extractImageData(photoData.uri));

        try {
            const now = new Date();

            const { data } = await axios.post(
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

            console.log("Done uploading image: ", data);

            // navigation.goBack();
        } catch (error) {
            debugAxiosError(error);
            setUploading(false);
            await cameraRef?.current?.resumePreview();
            setPreview(false);
            toast.show("There is problem uploading photo");
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
                <Camera
                    type={type}
                    ref={cameraRef}
                    useCamera2Api={true}
                    style={styles.camera}
                    onCameraReady={() => setCameraIsReady(true)}
                />
                {preview ? (
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => {
                            cameraRef?.current?.resumePreview();
                            setPreview(false);
                        }}>
                        <Ionicons name="close-circle" size={40} color="black" />
                    </TouchableOpacity>
                ) : null}
            </View>
            <View style={styles.buttonContainer}>
                {preview ? (
                    <View style={styles.uploadViewArea}>
                        <TouchableOpacity onPress={uploadPhoto}>
                            <Ionicons name="checkmark-circle-outline" size={45} color="green" />
                        </TouchableOpacity>
                    </View>
                ) : null}
                <TouchableOpacity disabled={preview || !cameraIsReady} onPress={takePhoto}>
                    <CapturePhotoBtn />
                </TouchableOpacity>
                <View style={styles.flipArea}>
                    <TouchableOpacity disabled={preview} onPress={flipCamera}>
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
    closeBtn: {
        position: "absolute",
        top: 30,
        right: 20,
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
    uploadViewArea: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: RFPercentage(3),
        flexDirection: "column",
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
