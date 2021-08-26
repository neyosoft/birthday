import React, { useRef, useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { useToast } from "react-native-fast-toast";
import { RFPercentage } from "react-native-responsive-fontsize";

import OTPTextView from "react-native-otp-textinput";

import { theme } from "../../theme";
import { useAuth } from "../../context";
import { BackIcon } from "../../../assets/svg";
import { AppButton, AppText, Page, PasswordField } from "../../components";
import { debugAxiosError, extractResponseErrorMessage } from "../../utils/request.utils";

export const ChangePIN = ({ navigation }) => {
    const pinInput = useRef();
    const toast = useToast();
    const confirmPinInput = useRef();
    const { authenticatedRequest } = useAuth();

    const [loading, setLoading] = useState(false);

    const [pin, setPin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPin, setConfirmPin] = useState("");

    const handleSubmit = async () => {
        if (password.length < 6) {
            return toast.show("Password can not be less than 6 characters.");
        }
        if (pin.length != 4) {
            return toast.show("PIN must be 4 characters.");
        }
        if (pin !== confirmPin) {
            return toast.show("Confirm PIN does not match.");
        }

        setLoading(true);

        try {
            await authenticatedRequest().put("/app/auth/pin/change/v2", null, {
                params: { newPin: pin, password },
            });

            toast.show("PIN successfully changed..");

            navigation.navigate("Profile");
        } catch (error) {
            debugAxiosError(error);
            toast.show(extractResponseErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                    <BackIcon />
                </TouchableOpacity>

                <View style={styles.titleRow}>
                    <AppText style={styles.title}>Change Transaction PIN</AppText>
                </View>

                <AppText style={styles.welcomeMessage}>Secure your account with your transaction PIN</AppText>

                <View style={styles.form}>
                    <PasswordField label="Your password" value={password} onChangeText={setPassword} />

                    <AppText style={[styles.label, { marginTop: RFPercentage(2) }]}>Enter 4 digits PIN</AppText>
                    <OTPTextView
                        ref={pinInput}
                        inputCount={4}
                        secureTextEntry={true}
                        keyboardType="numeric"
                        handleTextChange={setPin}
                        tintColor={theme.color.secondary}
                        offTintColor={theme.color.primary}
                        textInputStyle={styles.roundedTextInput}
                        containerStyle={styles.textInputContainer}
                    />

                    <AppText style={styles.label}>Confirm 4 digits PIN</AppText>
                    <OTPTextView
                        inputCount={4}
                        ref={confirmPinInput}
                        keyboardType="numeric"
                        secureTextEntry={true}
                        handleTextChange={setConfirmPin}
                        tintColor={theme.color.secondary}
                        offTintColor={theme.color.primary}
                        textInputStyle={styles.roundedTextInput}
                        containerStyle={styles.textInputContainer}
                    />

                    <View style={styles.buttonWrapper}>
                        <AppButton
                            label="Complete"
                            loading={loading}
                            disabled={loading}
                            variant="secondary"
                            onPress={handleSubmit}
                        />
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
    label: {
        fontSize: 15,
        marginBottom: 5,
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
        borderWidth: 0,
        color: theme.white,
        borderBottomWidth: 2,
        width: RFPercentage(8),
        height: RFPercentage(7),
        fontSize: RFPercentage(3),
        borderRadius: theme.radii.sm,
        backgroundColor: theme.color.primary,
    },
    buttonWrapper: {
        marginTop: 40,
    },
    resendTextStyle: {
        color: theme.color.yellow,
    },
});
