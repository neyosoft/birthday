import React from "react";
import { StyleSheet, View, Image, ScrollView, TouchableOpacity } from "react-native";

import { BackIcon } from "../../../assets/svg";
import HandIcon from "../../../assets/images/hand.png";
import { AppText, Page, AppButton, TextField, PasswordField } from "../../components";

import { theme } from "../../theme";

export const CreateAccount = ({ navigation }) => {
    return (
        <Page>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                    <BackIcon />
                </TouchableOpacity>
                <View style={styles.titleRow}>
                    <AppText style={styles.title}>Create Account</AppText>
                    <Image source={HandIcon} style={styles.titleIcon} />
                </View>
                <AppText style={styles.welcomeMessage}>
                    Get celebrated while celebrating others. Kindly provide your bank verification number (BVN)
                </AppText>

                <View style={styles.form}>
                    <TextField label="First Name" placeholder="Enter first name" />
                    <TextField style={styles.formField} label="Last Name" placeholder="Enter last name" />
                    <TextField style={styles.formField} label="Email" placeholder="Enter email address" />
                    <TextField
                        style={styles.formField}
                        label="Phone Number"
                        placeholder="e.g 08099999999"
                        keyboardType="number-pad"
                    />
                    <PasswordField
                        style={styles.formField}
                        style={{ marginTop: 20 }}
                        label="Password"
                        placeholder="Enter password"
                    />

                    <AppButton
                        label="Continue"
                        variant="secondary"
                        style={styles.validateBtn}
                        onPress={() => navigation.navigate("SignupDateofBirth")}
                    />

                    <AppButton variant="primary" label="Skip in stead" style={styles.infoBtn} />
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
    formField: {
        marginTop: 15,
    },
    validateBtn: {
        marginTop: 40,
    },
    infoBtn: {
        marginTop: 20,
    },
});
