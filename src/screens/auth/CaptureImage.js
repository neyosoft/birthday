import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppButton, AppText, Page } from "../../components";

import ImageFrame from "../../../assets/images/image-frame.png";

export const CaptureImage = () => {
    return (
        <Page style={styles.container}>
            <View style={styles.frameWrapper}>
                <Image source={ImageFrame} />
            </View>
            <View>
                <AppButton variant="secondary" label="Continue" />
                <AppButton variant="primary" style={styles.retakeBtn}>
                    <View style={styles.retakeBtnInerContent}>
                        <Ionicons name="reload-outline" size={20} color="#fff" />
                        <AppText style={styles.retakeBtnText}>Retake</AppText>
                    </View>
                </AppButton>
            </View>
        </Page>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
    },
    frameWrapper: {
        marginTop: 100,
        alignItems: "center",
    },
    retakeBtn: {
        marginTop: 20,
    },
    retakeBtnInerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    retakeBtnText: {
        marginLeft: 10,
    },
});
