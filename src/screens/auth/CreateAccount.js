import React from "react";
import { Formik } from "formik";
import { object, string } from "yup";
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Linking } from "react-native";

import { theme } from "../../theme";
import { BackIcon } from "../../../assets/svg";
import HandIcon from "../../../assets/images/hand.png";
import { AppText, AppButton, TextField, PasswordField } from "../../components";

export const CreateAccount = ({ navigation }) => {
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
                validationSchema={registrationSchema}
                initialValues={{ firstName: "", lastName: "", email: "", phoneNumber: "", password: "" }}
                onSubmit={(values) => {
                    navigation.navigate("SignupDateofBirth", { record: values });
                }}>
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
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
                            style={styles.formField}
                            style={{ marginTop: 20 }}
                            placeholder="Enter password"
                            onBlur={handleBlur("password")}
                            onChangeText={handleChange("password")}
                            hasError={errors.password && touched.password}
                        />

                        <AppText
                            style={{
                                fontSize: 13,
                                color: "gray",
                                marginTop: 4,
                                width: "90%",
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
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@_#\$%\^\(\)\[\]\-:;,\?\+=\/'"<>&\*])(?=.{8,})/,
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
});
