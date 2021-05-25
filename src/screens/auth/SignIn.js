import React from "react";
import { Formik } from "formik";
import { object, string } from "yup";
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, Alert } from "react-native";

import LockImage from "../../../assets/images/lock.png";
import { BackIcon, BarcodeScan, Fingerprint } from "../../../assets/svg";
import { AppText, Page, AppButton, TextField, PasswordField } from "../../components";

import { theme } from "../../theme";
import { baseRequest } from "../../utils/request.utils";

import { useAuth } from "../../context";

export const SignIn = ({ navigation }) => {
    const { authenticate } = useAuth();

    const handleSubmit = async (values) => {
        const params = new URLSearchParams();

        params.append("username", values.email);
        params.append("password", values.password);
        params.append("grant_type", "password");
        params.append("client_id", "api-access");
        params.append("client_secret", "977d186a-095b-4705-a1cb-26b774fce3e1");

        try {
            const { data } = await baseRequest.post("/auth/realms/vibes/protocol/openid-connect/token", params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            if (data && data.access_token && data.refresh_token) {
                await authenticate({ accessToken: data.access_token, refreshToken: data.refresh_token });
            }
        } catch (error) {
            console.log("error message: ", error);

            let message;

            if (error.response) {
                message = error.response.data.error_description;
            } else {
                message = error.message;
            }
            Alert.alert("Sign In Failed.", message);
        }
    };

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

                <Formik
                    validationSchema={loginSchema}
                    initialValues={{ email: "", password: "" }}
                    onSubmit={handleSubmit}>
                    {({ isSubmitting, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <>
                            <View style={styles.form}>
                                <TextField
                                    value={values.email}
                                    label="Email Address"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    onBlur={handleBlur("email")}
                                    placeholder="Enter email address"
                                    onChangeText={handleChange("email")}
                                    hasError={errors.email && touched.email}
                                />
                                <PasswordField
                                    label="Password"
                                    value={values.password}
                                    style={{ marginTop: 20 }}
                                    placeholder="Enter password"
                                    onBlur={handleBlur("password")}
                                    onChangeText={handleChange("password")}
                                    hasError={errors.password && touched.password}
                                />

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
                                <AppButton
                                    label="Sign In"
                                    variant="secondary"
                                    onPress={handleSubmit}
                                    disabled={isSubmitting}
                                />

                                <AppButton
                                    variant="primary"
                                    label="Create Account"
                                    style={styles.btnSeparator}
                                    onPress={() => navigation.navigate("CreateAccount")}
                                />
                            </View>
                        </>
                    )}
                </Formik>
            </ScrollView>
        </Page>
    );
};

const loginSchema = object().shape({
    email: string().required().email().lowercase().trim(),
    password: string().required("Password is required").min(8),
});

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
