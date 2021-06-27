import React, { useState } from "react";
import { useToast } from "react-native-fast-toast";
import { StyleSheet, View, Image, ScrollView, TouchableOpacity } from "react-native";

import { BackIcon } from "../../../assets/svg";
import HandIcon from "../../../assets/images/hand.png";
import { baseRequest } from "../../utils/request.utils";
import { AppText, Page, AppButton, TextField } from "../../components";

export const ForgetPassword = ({ navigation }) => {
    const toast = useToast();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);

        if (email.trim().length < 1) {
            return toast.show("Email is required.");
        }

        const now = new Date();

        try {
            await baseRequest.post(`/app/auth/change/password/${email}`, {
                headers: {
                    TimeStamp: `${now.getFullYear()}-${
                        now.getMonth() + 1
                    }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`,
                },
            });

            navigation.navigate("SignIn");

            toast.show("Kindly check your email to complete password change.");
        } catch (error) {
            toast.show("There is a problem changing password.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <Page>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                    <BackIcon />
                </TouchableOpacity>
                <View style={styles.titleRow}>
                    <AppText style={styles.title}>Forget Password</AppText>
                    <Image source={HandIcon} style={styles.titleIcon} />
                </View>
                <AppText style={styles.welcomeMessage}>Enter your email address to reset your password.</AppText>

                <View style={styles.form}>
                    <TextField
                        value={email}
                        label="Email"
                        autoCapitalize="none"
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        placeholder="someone@yahoo.com"
                    />

                    <AppButton
                        disabled={loading}
                        variant="secondary"
                        onPress={handleSubmit}
                        style={styles.continueBtn}
                        label={loading ? "Processing..." : "Continue"}
                    />
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
    titleIcon: {
        marginLeft: 10,
    },
    welcomeMessage: {
        color: "#F6F6F6",
    },
    form: {
        marginTop: 30,
    },
    continueBtn: {
        marginTop: 50,
    },
});
