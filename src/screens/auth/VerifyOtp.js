import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";

import OTPTextView from "react-native-otp-textinput";

import { theme } from "../../theme";
import { BackIcon } from "../../../assets/svg";
import { AppText, Page } from "../../components";

export const VerifyOtp = ({ navigation }) => {
    const otpInput = useRef();
    const [otp, setOtp] = useState("");

    useEffect(() => {
        if (otp.length === 4) {
            handleSubmit();
        }
    }, [otp]);

    const handleSubmit = () => {
        console.log("Verifying OTP: ", otp);
    };

    return (
        <Page>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                    <BackIcon />
                </TouchableOpacity>
                <View style={styles.titleRow}>
                    <AppText style={styles.title}>Verify Phone number</AppText>
                </View>

                <AppText style={styles.welcomeMessage}>We sent you an OTP code as sms</AppText>

                <View style={styles.form}>
                    <OTPTextView
                        ref={otpInput}
                        inputCount={4}
                        keyboardType="numeric"
                        handleTextChange={setOtp}
                        tintColor={theme.color.secondary}
                        offTintColor={theme.color.primary}
                        textInputStyle={styles.roundedTextInput}
                        containerStyle={styles.textInputContainer}
                    />

                    <View style={styles.resendRow}>
                        <AppText>Didnt’ receive OTP?</AppText>
                        <TouchableOpacity style={{ marginLeft: 5 }}>
                            <AppText style={styles.resendTextStyle}>Resend</AppText>
                        </TouchableOpacity>
                    </View>
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
    button: {
        marginTop: 20,
    },
    textInputContainer: {
        marginBottom: 20,
    },
    roundedTextInput: {
        width: 75,
        height: 66,
        fontSize: 20,
        borderWidth: 0,
        color: theme.white,
        borderBottomWidth: 2,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.color.primary,
    },
    resendRow: {
        marginTop: 40,
        flexDirection: "row",
        justifyContent: "center",
    },
    resendTextStyle: {
        color: theme.color.yellow,
    },
});
