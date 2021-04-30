import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";

import { BackIcon } from "../../../assets/svg";
import { AppText, Page, AppButton, TextField, PasswordField, AutoFillField, DateField } from "../../components";

export const VerifyDetails = ({ navigation }) => {
    return (
        <Page>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                    <BackIcon />
                </TouchableOpacity>
                <View style={styles.titleRow}>
                    <AppText style={styles.title}>Verify Details</AppText>
                </View>

                <AppText style={styles.welcomeMessage}>Kindly verify the details provided from bvn</AppText>

                <View style={styles.form}>
                    <AutoFillField value="Emmanuel" />
                    <AutoFillField value="Adeniyi" style={styles.formGroup} />
                    <DateField
                        label="Date of Birth"
                        placeholder="DD - MM - YY"
                        keyboardType="number-pad"
                        style={styles.formGroup}
                    />
                    <TextField
                        style={styles.formGroup}
                        label="Complete the phone number below"
                        placeholder="0802404 - "
                        keyboardType="number-pad"
                    />
                    <TextField label="Email" style={styles.formGroup} placeholder="Enter email address" />
                    <PasswordField style={styles.formGroup} label="Password" placeholder="Enter password" />

                    <AppButton variant="secondary" label="Continue" style={styles.button} />
                    <AppButton variant="primary" label="Sign in Instead" style={styles.button} />
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
    formGroup: {
        marginTop: 15,
    },
    button: {
        marginTop: 20,
    },
});
