import React from "react";
import { StyleSheet, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

export const CapturePhotoBtn = ({ style }) => <View style={[style, styles.container]}></View>;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        width: RFPercentage(7),
        height: RFPercentage(7),
        backgroundColor: "#fff",
        justifyContent: "center",
        borderRadius: RFPercentage(4),
    },
});
