import React from "react";
import { StyleSheet, Image, View } from "react-native";

import { AppText, Page, AppButton } from "../../components";
import Illustration1 from "../../../assets/images/illustration1.png";

export const Welcome = ({ navigation }) => {
    return (
        <Page style={styles.container}>
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
        </Page>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-end",
    },
    illustration: {
        height: 299,
        width: 288.75,
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
});
