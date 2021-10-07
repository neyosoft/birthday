import React, { useState, useRef } from "react";
// import { Camera } from "expo-camera";
import { RNCamera } from "react-native-camera";

import { useQuery } from "react-query";
import { useIsFocused } from "@react-navigation/core";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { theme } from "../../theme";
import { useAuth } from "../../context";

import { BackIcon } from "../../../assets/svg";
import { AppText } from "../../components";
import { RFPercentage } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";

export const ThankYouVideo = ({ navigation }) => {
    const cameraRef = useRef();
    const isFocused = useIsFocused();

    const { user, authenticatedRequest } = useAuth();

    const startRecording = async () => {
        try {
            const videoPath = await cameraRef?.current?.recordAsync();

            console.log("videoPath: ", videoPath);
        } catch (error) {
            console.log("Something went wrong: ", error);
        }
    };

    // if (!isFocused) return null;

    return (
        <SafeAreaView style={{ backgroundColor: "red", flex: 1 }}>
            <RNCamera />
        </SafeAreaView>
    );

    return (
        <RNCamera
            ref={cameraRef}
            style={styles.camera}
            androidCameraPermissionOptions={{
                title: "Permission to use camera",
                message: "We need your permission to use your camera",
                buttonPositive: "Ok",
                buttonNegative: "Cancel",
            }}
            androidRecordAudioPermissionOptions={{
                title: "Permission to use audio recording",
                message: "We need your permission to use your audio",
                buttonPositive: "Ok",
                buttonNegative: "Cancel",
            }}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: theme.backgroundColor,
    },
    backBtnArea: {
        padding: 25,
        paddingBottom: 20,
        flexDirection: "row",
    },
    camera: {
        flex: 1,
        justifyContent: "flex-end",
    },
    actionableBox: {
        alignItems: "center",
        margin: RFPercentage(2),
    },
    recordBtn: {
        borderRadius: 10,
        paddingVertical: RFPercentage(1),
        paddingHorizontal: RFPercentage(4),
        backgroundColor: theme.color.primary,
    },
    btnText: {
        color: "#fff",
        fontSize: RFPercentage(1.8),
    },
});
