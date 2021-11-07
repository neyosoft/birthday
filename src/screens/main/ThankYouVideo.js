import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useIsFocused } from "@react-navigation/core";

import { theme } from "../../theme";
import { useAuth } from "../../context";

import { RFPercentage } from "react-native-responsive-fontsize";

export const ThankYouVideo = ({ navigation }) => {
    const cameraRef = useRef();
    const isFocused = useIsFocused();

    const startRecording = async () => {
        try {
            const videoPath = await cameraRef?.current?.recordAsync();

            console.log("videoPath: ", videoPath);
        } catch (error) {
            console.log("Something went wrong: ", error);
        }
    };

    if (!isFocused) return null;

    return <View style={StyleSheet.absoluteFill} isActive={true} />;
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
