import React from "react";
import { StyleSheet, Image, View, Dimensions } from "react-native";

import { AppText, Page, AppButton } from "../../components";
import Illustration1 from "../../../assets/images/illustration1.png";
import Logo from "../../../assets/images/Logo.png";
import Config from "../../config";
import { theme } from "../../theme";

const { width } = Dimensions.get("window");

export const Welcome = ({ navigation }) => {
    return (
        <Page style={styles.container}>
            <Image source={Logo} style={styles.logo} />
            <Image source={Illustration1} style={styles.illustration} resizeMode="contain" />
            <View style={styles.textWrapper}>
                <AppText style={styles.title}>Celebrate with others while celebrating yourself</AppText>
                <AppText style={styles.description}>Share fun moments with friends and loved ones</AppText>
            </View>
            <View style={styles.buttonWrapper}>
                <AppButton variant="secondary" label="Sign In" onPress={() => navigation.navigate("SignIn")} />
                <AppButton
                    variant="primary"
                    label="Create Account"
                    style={styles.btnSeparator}
                    onPress={() => navigation.navigate("CreateAccount")}
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
    illustration: {
        width: "90%",
        height: width * 0.7,
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
        fontSize: 13,
        marginTop: 6,
        color: "#A3A2A2",
        textAlign: "center",
    },
    buttonWrapper: {
        marginTop: 50,
        marginBottom: 15,
    },
    btnSeparator: {
        marginTop: 16,
    },
    versionbox: {
        marginBottom: -10,
        flexDirection: "row",
        justifyContent: "center",
    },
});
