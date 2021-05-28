import OTPTextView from "react-native-otp-textinput";
import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";

import { theme } from "../../theme";
import { useAuth } from "../../context";
import { BackIcon } from "../../../assets/svg";
import { AppText, Page } from "../../components";
import { extractResponseErrorMessage } from "../../utils/request.utils";

export const VerifyPhoneNumber = ({ navigation }) => {
    const { user, refreshUser, authenticatedRequest } = useAuth();
    const [loading, setLoading] = useState(false);

    const otpInput = useRef();
    const [otp, setOtp] = useState("");

    const sendOTP = async () => {
        setLoading(true);
        try {
            await authenticatedRequest().post(`/app/auth/otp/${user.mobileNumber}`);
        } catch (error) {
            console, log("There is a problem sending OTP: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        sendOTP();
    }, []);

    useEffect(() => {
        if (otp.length === 6) {
            handleSubmit();
        }
    }, [otp]);

    const handleSubmit = async () => {
        try {
            const { data } = await authenticatedRequest().post(`/app/auth/otp/verify/${user.mobileNumber}/${otp}`);

            if (data && data.responseCode === "00") {
                await refreshUser();

                navigation.navigate("Profile");
            } else {
                Alert.alert("Verification", extractResponseErrorMessage(error));
            }
        } catch (error) {
            Alert.alert("Verification", extractResponseErrorMessage(error));
        }
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
                        inputCount={6}
                        keyboardType="numeric"
                        handleTextChange={setOtp}
                        tintColor={theme.color.secondary}
                        offTintColor={theme.color.primary}
                        textInputStyle={styles.roundedTextInput}
                        containerStyle={styles.textInputContainer}
                    />

                    {loading ? (
                        <View style={styles.resendRow}>
                            <ActivityIndicator color="white" size="large" />
                            <AppText>Sending OTP</AppText>
                        </View>
                    ) : (
                        <View style={styles.resendRow}>
                            <AppText>Didnt’ receive OTP?</AppText>
                            <TouchableOpacity style={{ marginLeft: 5 }} onPress={sendOTP}>
                                <AppText style={styles.resendTextStyle}>Resend</AppText>
                            </TouchableOpacity>
                        </View>
                    )}
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
        width: 50,
        height: 50,
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
