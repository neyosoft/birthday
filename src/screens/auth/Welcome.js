import React from "react";
import { StyleSheet, Image, View } from "react-native";

import { AppText, Page, AppButton } from "../../components";
import Illustration1 from "../../../assets/images/illustration1.png";

export const Welcome = () => {
    return (
        <Page style={styles.container}>
            <Image source={Illustration1} style={styles.illustration} />
            <View style={styles.textWrapper}>
                <AppText style={styles.title}>Celebrate with others while celebrating yourself</AppText>
                <AppText style={styles.description}>Share fun moments with friends and loved ones</AppText>
            </View>
            <View style={styles.buttonWrapper}>
                <AppButton variant="secondary" label="Sign In" />
                <AppButton style={styles.btnSeparator} variant="primary" label="Create Account" />
            </View>
        </Page>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-end",
    },
    illustration: {
        alignSelf: "center",
    },
    textWrapper: {
        marginTop: 30,
        width: "90%",
        alignSelf: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        textAlign: "center",
    },
    description: {
        fontSize: 15,
        marginTop: 6,
        color: "#A3A2A2",
    },
    buttonWrapper: {
        marginTop: 60,
        marginBottom: 15,
    },
    btnSeparator: {
        marginTop: 16,
    },
});
