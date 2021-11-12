import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import ImagePicker from "expo-image-picker";
import { useToast } from "react-native-fast-toast";
import React, { useRef, useState, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";

import Config from "../../config";
import { theme } from "../../theme";
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

    useEffect(() => {
        (async () => {
            // const { status } = await ImagePicker.requestCameraPermissionsAsync();

            // console.log("status: ", status);

            if (true) {
                setHasPermission(true);
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.8,
                });

                console.log(result);
            } else {
                setHasPermission(false);
            }
        })();
    }, []);

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

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.cameraArea}></View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity disabled={preview} onPress={takePhoto}>
                    <CapturePhotoBtn />
                </TouchableOpacity>
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
        // height: width * 1.6,
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
