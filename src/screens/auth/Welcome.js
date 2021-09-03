import React from "react";
import { StyleSheet, Image, View } from "react-native";

import Config from "../../config";
import Logo from "../../../assets/images/Logo.png";
import { AppText, Page, AppButton } from "../../components";
import WelcomeImg from "../../../assets/images/welcome.png";
import { RFPercentage } from "react-native-responsive-fontsize";

export const Welcome = ({ navigation }) => {
    return (
        <Page style={styles.container}>
            <Image source={Logo} style={styles.logo} />
            <View style={styles.welcomeImageWrapper}>
                <Image source={WelcomeImg} style={styles.welcomeImgStyle} resizeMode="contain" />
            </View>
            <View style={styles.textWrapper}>
                <AppText style={styles.title}>Celebrate with others while celebrating yourself</AppText>
                <AppText style={styles.description}>Share fun moments with friends and loved ones</AppText>
            </View>
            <View style={styles.buttonWrapper}>
                <AppButton
                    variant="primary"
                    style={styles.btn}
                    label="Create Account"
                    labelStyle={styles.btnLabel}
                    onPress={() => navigation.navigate("CreateAccount")}
                />
                <AppButton
                    label="Sign In"
                    style={styles.btn}
                    variant="secondary"
                    labelStyle={styles.btnLabel}
                    onPress={() => navigation.navigate("SignIn")}
                />
            </View>

            <View style={styles.versionbox}>
                <AppText style={{ fontSize: 12, color: "gray" }}>App version: </AppText>
                <AppText style={{ fontSize: 12 }}>{Config.appVersion}</AppText>
            </View>
        </Page>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-end",
    },
    logo: {
        width: 129,
        height: 40,
        alignSelf: "center",
        marginBottom: RFPercentage(7),
    },
    welcomeImageWrapper: {
        width: "100%",
        alignItems: "center",
    },
    welcomeImgStyle: {
        width: RFPercentage(40),
        height: RFPercentage(40),
    },
    textWrapper: {
        width: "90%",
        marginTop: 30,
        alignSelf: "center",
        alignItems: "center",
    },
    title: {
        textAlign: "center",
        fontSize: RFPercentage(2.4),
    },
    description: {
        marginTop: 6,
        color: "#A3A2A2",
        textAlign: "center",
        fontSize: RFPercentage(1.9),
    },
    buttonWrapper: {
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        marginTop: RFPercentage(6),
        justifyContent: "space-between",
    },
    btn: {
        width: "47%",
    },
    btnLabel: {
        fontSize: RFPercentage(1.8),
    },
    versionbox: {
        marginBottom: -10,
        flexDirection: "row",
        justifyContent: "center",
    },
});
