import React from "react";
import { StyleSheet, Image, View, Dimensions } from "react-native";

import Config from "../../config";
import Logo from "../../../assets/images/Logo.png";
import { AppText, Page, AppButton } from "../../components";
import WelcomeImg from "../../../assets/images/welcome.png";

const { width } = Dimensions.get("window");

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
                    onPress={() => navigation.navigate("CreateAccount")}
                />
                <AppButton
                    label="Sign In"
                    style={styles.btn}
                    variant="secondary"
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
        marginBottom: 50,
        alignSelf: "center",
    },
    welcomeImageWrapper: {
        width: "100%",
    },
    welcomeImgStyle: {
        width: "90%",
        height: width * 0.7,
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
        fontSize: 13,
        marginTop: 6,
        color: "#A3A2A2",
        textAlign: "center",
    },
    buttonWrapper: {
        marginTop: 50,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    btn: {
        width: "47%",
    },
    versionbox: {
        marginBottom: -10,
        flexDirection: "row",
        justifyContent: "center",
    },
});
