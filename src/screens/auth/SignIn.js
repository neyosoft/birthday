import React, { useState } from "react";
import { Formik } from "formik";
import { object, string } from "yup";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { useToast } from "react-native-fast-toast";
import * as Notifications from "expo-notifications";
import * as LocalAuthentication from "expo-local-authentication";
import crashlytics from "@react-native-firebase/crashlytics";
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, Platform } from "react-native";

import LockImage from "../../../assets/images/lock.png";
import { BackIcon, BarcodeScan, Fingerprint } from "../../../assets/svg";
import { AppText, Page, AppButton, TextField, PasswordField } from "../../components";

import Config from "../../config";
import { theme } from "../../theme";
import { useAuth } from "../../context";
import { baseRequest } from "../../utils/request.utils";
import { getBiometricLogin, saveBiometricLogin } from "../../utils/storage.utils";

export const SignIn = ({ navigation }) => {
    const { authenticate } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        const params = new URLSearchParams();

        params.append("username", values.email);
        params.append("password", encodeURIComponent(values.password));
        params.append("grant_type", "password");
        params.append("client_id", "api-access");
        params.append("client_secret", "977d186a-095b-4705-a1cb-26b774fce3e1");

        try {
            setLoading(true);

            const { data } = await baseRequest.post("/auth/realms/vibes/protocol/openid-connect/token", params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            crashlytics().log("User signed in.");

            const devicePayload = {
                osVersion: Device.osVersion,
                versionCode: Config.appVersion,
                deviceType: Platform.OS.toUpperCase(),
                deviceName: `${Device.manufacturer} - ${Device.brand} - ${Device.modelName}`,
                notificationToken: await registerForPushNotificationsAsync(),
            };

            console.log("devicePayload: ", devicePayload);

            if (data && data.access_token && data.refresh_token) {
                await saveBiometricLogin(values);

                try {
                    await baseRequest.put("/app/user/app/update", devicePayload, {
                        headers: {
                            Authorization: `Bearer ${data.access_token}`,
                        },
                    });
                } catch (error) {
                    crashlytics().recordError(error);
                }

                await authenticate({ accessToken: data.access_token, refreshToken: data.refresh_token });
            }
        } catch (error) {
            crashlytics().recordError(error);
            let message;

            if (error.response) {
                message = error.response.data.error_description;
            } else {
                message = error.message;
            }

            toast.show(message, { type: "danger" });

            setLoading(false);
        }
    };

    const handleBiometricLogin = async (type) => {
        setLoading(true);

        try {
            const isSupported = await LocalAuthentication.hasHardwareAsync();

            if (!isSupported) {
                throw new Error("Not currently supported. Kindly try manual login");
            }

            const supportedType = await LocalAuthentication.supportedAuthenticationTypesAsync();

            if (!supportedType.includes(type)) {
                throw new Error("Not currently supported. Kindly try manual login");
            }

            if (!LocalAuthentication.isEnrolledAsync()) {
                throw new Error("Device setup not completed. Kindly try manual login");
            }

            const loginInfo = await getBiometricLogin();

            if (!loginInfo) {
                throw new Error("You need to first try manual login before this feature is enable.");
            }

            const response = await LocalAuthentication.authenticateAsync({
                promptMessage: "Login with Biometrics.",
            });

            if (response.success) {
                await handleSubmit(JSON.parse(loginInfo));
            } else {
                throw new Error("Unable to login with biometrics at the moment...");
            }
        } catch (error) {
            crashlytics().recordError(error);
            setLoading(false);
            toast.show(error.message);
        }
    };

    const registerForPushNotificationsAsync = async () => {
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();

            let finalStatus = existingStatus;
            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== "granted") {
                alert("Failed to get push token for push notification!");
                return;
            }

            return (await Notifications.getExpoPushTokenAsync()).data;
        } else {
            alert("Must use physical device for Push Notifications");
        }

        if (Platform.OS === "android") {
            Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
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
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
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

                                <TouchableOpacity onPress={() => navigation.navigate("ForgetPassword")}>
                                    <AppText style={styles.forgetPasswordStyle}>Forget Password?</AppText>
                                </TouchableOpacity>

                                <View style={styles.securityRole}>
                                    <TouchableOpacity onPress={() => handleBiometricLogin(2)}>
                                        <BarcodeScan />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ marginLeft: 35 }}
                                        onPress={() => handleBiometricLogin(1)}>
                                        <Fingerprint />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.buttonWrapper}>
                                <AppButton
                                    disabled={loading}
                                    variant="secondary"
                                    onPress={handleSubmit}
                                    label={loading ? "Processing..." : "Sign In"}
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
