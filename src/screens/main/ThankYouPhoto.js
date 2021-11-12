import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "react-native-fast-toast";
import React, { useState, useEffect } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, Image, StatusBar, Dimensions, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";

import Config from "../../config";
import { theme } from "../../theme";
import { useAuth } from "../../context";
import { AppText, CapturePhotoBtn } from "../../components";
import { extractResponseErrorMessage } from "../../utils/request.utils";

const { width } = Dimensions.get("window");

export const ThankYouPhoto = ({ navigation }) => {
    const toast = useToast();

    const { user, accessToken } = useAuth();

    const [photoData, setPhotoData] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        (async () => {
            launchImageLibrary(
                {
                    maxWidth: 500,
                    maxHeight: 500,
                    mediaType: "photo",
                    saveToPhotos: false,
                    includeBase64: false,
                },
                async response => {
                    if (response.assets && response.assets.length === 1) {
                        const result = response.assets[0];

                        setPhotoData(result);
                    }
                },
            );
        })();
    }, []);

    const takePhoto = async () => {
        launchImageLibrary(
            {
                maxWidth: 500,
                maxHeight: 500,
                mediaType: "photo",
                saveToPhotos: false,
                includeBase64: false,
            },
            async response => {
                if (response.assets && response.assets.length === 1) {
                    const result = response.assets[0];

                    setPhotoData(result);
                }
            },
        );
    };

    const uploadPhoto = async () => {
        setUploading(true);

        const now = new Date();

        const formdata = new FormData();
        formdata.append("mediaFile", { uri: photoData.uri, type: photoData.type, name: photoData.fileName });

        try {
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
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.photoContainer}>
                {photoData ? (
                    <Image resizeMode="cover" style={styles.photo} source={photoData} />
                ) : (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <AppText>No image selected</AppText>
                    </View>
                )}
                {photoData && !uploading ? (
                    <TouchableOpacity style={styles.acceptBtn} onPress={uploadPhoto}>
                        <Ionicons name="checkmark-circle-sharp" size={RFPercentage(5)} color="#03E895" />
                    </TouchableOpacity>
                ) : null}
            </View>
            <View style={styles.buttonContainer}>
                {uploading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#03E895" />
                        <AppText style={styles.loadingText}>Uploading photo...</AppText>
                    </View>
                ) : (
                    <TouchableOpacity onPress={takePhoto}>
                        <CapturePhotoBtn />
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity style={styles.backBtn} onPress={navigation.goBack}>
                <Ionicons name="arrow-back-sharp" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
        backgroundColor: theme.backgroundColor,
    },
    backBtn: {
        position: "absolute",
        top: 30,
        left: 20,
    },
    acceptBtn: {
        position: "absolute",
        top: 30,
        right: 20,
    },
    photoContainer: {
        width,
        // height: width * 1.6,
        height: (width / 3) * 4,
        backgroundColor: "gray",
    },
    photo: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    buttonContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    loadingContainer: {
        alignItems: "center",
    },
    loadingText: {
        color: "#fff",
        marginTop: RFPercentage(1),
    },
});
