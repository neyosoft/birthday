import React from "react";
import { Formik } from "formik";
import { object, string } from "yup";
import { useToast } from "react-native-fast-toast";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Linking } from "react-native";

import { baseRequest } from "../../utils/request.utils";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@_#\$\.%\^\(\)\[\]\-:;,\?\+=\/'"<>&\*])(?=.{8,})/;

const renderPasswordStrength = (password) => {
    if (!password) return null;

    if (password.length < 8) {
        return (
            <View>
                <View style={styles.passwordFeedbackBarRow}>
                    <View style={[styles.passwordFeedbackBar, { backgroundColor: "#D81212" }]}></View>
                    <View style={styles.passwordFeedbackBar}></View>
                    <View style={styles.passwordFeedbackBar}></View>
                    <View style={styles.passwordFeedbackBar}></View>
                </View>
                <View style={styles.passwordFeedbackRow}>
                    <Image source={require("../../../assets/images/password_weak.png")} />
                    <AppText style={styles.passwordFeedbackText}>Password is weak.</AppText>
                </View>
            </View>
        );
    }

    if (passwordRegex.test(password)) {
        return (
            <View>
                <View style={styles.passwordFeedbackBarRow}>
                    <View style={[styles.passwordFeedbackBar, { backgroundColor: "#03E895" }]}></View>
                    <View style={[styles.passwordFeedbackBar, { backgroundColor: "#03E895" }]}></View>
                    <View style={[styles.passwordFeedbackBar, { backgroundColor: "#03E895" }]}></View>
                    <View style={[styles.passwordFeedbackBar, { backgroundColor: "#03E895" }]}></View>
                </View>
                <View style={styles.passwordFeedbackRow}>
                    <Image source={require("../../../assets/images/password_strong.png")} />
                    <AppText style={styles.passwordFeedbackText}>Password is strong.</AppText>
                </View>
            </View>
        );
    } else {
        return (
            <View>
                <View style={styles.passwordFeedbackBarRow}>
                    <View style={[styles.passwordFeedbackBar, { backgroundColor: "#FEC65A" }]}></View>
                    <View style={[styles.passwordFeedbackBar, { backgroundColor: "#FEC65A" }]}></View>
                    <View style={[styles.passwordFeedbackBar, { backgroundColor: "#FEC65A" }]}></View>
                    <View style={styles.passwordFeedbackBar}></View>
                </View>
                <View style={styles.passwordFeedbackRow}>
                    <Image source={require("../../../assets/images/password_okay.png")} />
                    <AppText style={styles.passwordFeedbackText}>Password is okay.</AppText>
                </View>
            </View>
        );
    }
};

import { theme } from "../../theme";
import { BackIcon } from "../../../assets/svg";
import HandIcon from "../../../assets/images/hand.png";
import { AppText, AppButton, TextField, PasswordField } from "../../components";

export const CreateAccount = ({ navigation }) => {
    const toast = useToast();

    const onSubmit = async (values) => {
        try {
            const { data } = await baseRequest.get(`/app/auth/account/exists/${values.email}/${values.phoneNumber}`);

            if (data && data.responseCode && data.responseCode === "30") {
                navigation.navigate("SignupDateofBirth", { record: values });
            } else {
                toast.show("Email already exists");
            }
        } catch (error) {
            toast.show("Email already exists");
        }
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20 }}
            style={{ backgroundColor: theme.backgroundColor }}>
            <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                <BackIcon />
            </TouchableOpacity>
            <View style={styles.titleRow}>
                <AppText style={styles.title}>Create Account</AppText>
                <Image source={HandIcon} style={styles.titleIcon} />
            </View>

            <Formik
                onSubmit={onSubmit}
                validationSchema={registrationSchema}
                initialValues={{ firstName: "", lastName: "", email: "", phoneNumber: "", password: "" }}>
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                    <View style={styles.form}>
                        <TextField
                            label="First Name"
                            value={values.firstName}
                            placeholder="Enter first name"
                            onBlur={handleBlur("firstName")}
                            onChangeText={handleChange("firstName")}
                            hasError={errors.firstName && touched.firstName}
                        />
                        <TextField
                            label="Last Name"
                            value={values.lastName}
                            style={styles.formField}
                            placeholder="Enter last name"
                            onBlur={handleBlur("lastName")}
                            onChangeText={handleChange("lastName")}
                            hasError={errors.lastName && touched.lastName}
                        />
                        <TextField
                            label="Email"
                            autoCapitalize="none"
                            value={values.email}
                            style={styles.formField}
                            onBlur={handleBlur("email")}
                            keyboardType="email-address"
                            placeholder="Enter email address"
                            onChangeText={handleChange("email")}
                            hasError={errors.email && touched.email}
                        />
                        <TextField
                            label="Phone Number"
                            style={styles.formField}
                            keyboardType="number-pad"
                            value={values.phoneNumber}
                            placeholder="e.g 08099999999"
                            onBlur={handleBlur("phoneNumber")}
                            onChangeText={handleChange("phoneNumber")}
                            hasError={errors.phoneNumber && touched.phoneNumber}
                        />
                        <PasswordField
                            label="Password"
                            value={values.password}
                            placeholder="Enter password"
                            onBlur={handleBlur("password")}
                            onChangeText={handleChange("password")}
                            style={[styles.formField, { marginVertical: 20 }]}
                            hasError={errors.password && touched.password}
                        />

                        {renderPasswordStrength(values.password)}

                        <AppText
                            style={{
                                fontSize: 13,
                                marginTop: 10,
                                width: "90%",
                                color: "gray",
                                lineHeight: 18,
                                alignSelf: "center",
                                textAlign: "center",
                            }}>
                            Password must be atleast 8 characters and must contain atleast one uppercase letter, one
                            number and one special character.
                        </AppText>

                        <AppText style={styles.agreementLink}>
                            By clicking on 'continue', you agree to our{" "}
                            <AppText
                                style={styles.link}
                                onPress={() => Linking.openURL("https://pokeet.co/terms-and-conditions")}>
                                Terms
                            </AppText>
                            {" and "}
                            <AppText
                                style={styles.link}
                                onPress={() => Linking.openURL("https://pokeet.co/privacy-policy")}>
                                Privacy
                            </AppText>
                        </AppText>

                        <AppButton
                            label="Continue"
                            variant="secondary"
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                            style={styles.validateBtn}
                        />
                    </View>
                )}
            </Formik>
        </ScrollView>
    );
};

const registrationSchema = object().shape({
    firstName: string().required("First name is required").trim(),
    lastName: string().required("Last name is required").trim(),
    email: string().email("Invalid email").required().lowercase(),
    phoneNumber: string().required("Phone number is required.").length(11).trim(),
    password: string()
        .required("Password is required.")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@_#\$\.%\^\(\)\[\]\-:;,\?\+=\/'"<>&\*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character",
        ),
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
    titleIcon: {
        marginLeft: 10,
    },
    form: {
        marginTop: 30,
    },
    formField: {
        marginTop: 15,
    },
    validateBtn: {
        marginTop: 40,
    },
    infoBtn: {
        marginTop: 20,
    },
    agreementLink: {
        fontSize: 12,
        marginTop: 20,
        lineHeight: 20,
        textAlign: "center",
    },
    link: {
        fontSize: 12,
        color: theme.color.secondary,
    },
    passwordFeedbackBarRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    passwordFeedbackBar: {
        height: 5,
        width: "23%",
        borderRadius: 10,
        backgroundColor: "#2D2D2D",
    },
    passwordFeedbackRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: RFPercentage(1.5),
    },
    passwordFeedbackText: {
        fontSize: RFPercentage(1.8),
        marginLeft: 5,
    },
});
