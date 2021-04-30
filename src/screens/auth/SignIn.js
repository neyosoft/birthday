import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, ScrollView } from "react-native";

import LockImage from "../../../assets/images/lock.png";
import { AppText, Page, AppButton, TextField, PasswordField } from "../../components";
import { BackIcon, BarcodeScan, Fingerprint } from "../../../assets/svg";

import { theme } from "../../theme";

export const SignIn = ({ navigation }) => {
    return (
        <Page>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                    <BackIcon />
                </TouchableOpacity>
                <View style={styles.titleRow}>
                    <AppText style={styles.title}>Sign In</AppText>
                    <Image source={LockImage} style={styles.lockIcon} />
                </View>
                <AppText style={styles.welcomeMessage}>Welcome, sign in to your account</AppText>

                <View style={styles.form}>
                    <TextField label="Email Address" placeholder="Enter email address" />
                    <PasswordField style={{ marginTop: 20 }} label="Password" placeholder="Enter password" />

                    <AppText style={styles.forgetPasswordStyle}>Forget Password?</AppText>

                    <View style={styles.securityRole}>
                        <TouchableOpacity>
                            <BarcodeScan />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 35 }}>
                            <Fingerprint />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.buttonWrapper}>
                    <AppButton variant="secondary" label="Sign In" />
                    <AppButton style={styles.btnSeparator} variant="primary" label="Create Account" />
                </View>
            </ScrollView>
        </Page>
    );
};

const styles = StyleSheet.create({
    backIcon: {
        marginVertical: 25,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
    },
    lockIcon: {
        marginLeft: 10,
    },
    welcomeMessage: {
        color: "#F6F6F6",
    },
    form: {
        marginTop: 30,
    },
    forgetPasswordStyle: {
        marginTop: 15,
        alignSelf: "center",
        color: theme.color.yellow,
    },
    securityRole: {
        marginVertical: 40,
        alignSelf: "center",
        flexDirection: "row",
    },
    buttonWrapper: {
        marginTop: 60,
        marginBottom: 15,
    },
    btnSeparator: {
        marginTop: 16,
    },
});
