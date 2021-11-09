import React from "react";
import { StyleSheet, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

export const RecordBtn = ({ style, recording = false }) => (
    <View style={[style, styles.container]}>
        <View style={recording ? styles.stopShape : styles.recordShape} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        width: RFPercentage(7),
        height: RFPercentage(7),
        backgroundColor: "#fff",
        justifyContent: "center",
        borderRadius: RFPercentage(4),
    },
    recordShape: {
        backgroundColor: "red",
        width: RFPercentage(2),
        height: RFPercentage(2),
        borderRadius: RFPercentage(1),
    },
    stopShape: {
        borderRadius: 5,
        width: RFPercentage(2),
        backgroundColor: "#000",
        height: RFPercentage(2),
    },
});
