import React, { useState } from "react";
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Alert } from "react-native";

import { theme } from "../../theme";
import { useAuth } from "../../context";
import { BackIcon } from "../../../assets/svg";
import HandIcon from "../../../assets/images/hand.png";
import { AppText, Page, AppButton, TextField } from "../../components";

export const VerifyBvn = ({ navigation }) => {
    const { refreshUser, authenticatedRequest } = useAuth();

    const [loading, setLoading] = useState(false);
    const [bvn, setBvn] = useState("");

    const handleSubmit = async () => {
        setLoading(false);

        if (bvn.trim().length !== 11) {
            return Alert.alert("OTP Validation", "OTP can only be eleven(11) characters.");
        }

        try {
            const { data } = await authenticatedRequest().post(`/app/bvn/verify/${bvn}`);

            if (data && data.responseCode === "00") {
                await refreshUser();

                navigation.navigate("Profile");
            } else {
                Alert.alert("Verification", "BVN verification failed.");
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
                    <AppText style={styles.title}>Create Account</AppText>
                    <Image source={HandIcon} style={styles.titleIcon} />
                </View>
                <AppText style={styles.welcomeMessage}>
                    Get celebrated while celebrating others. Kindly provide your bank verification number (BVN)
                </AppText>

                <View style={styles.form}>
                    <TextField
                        onChangeText={setBvn}
                        keyboardType="number-pad"
                        placeholder="221459940304"
                        label="Bank Verification Number"
                    />

                    <AppButton
                        label="Validate"
                        disabled={loading}
                        variant="secondary"
                        onPress={handleSubmit}
                        style={styles.validateBtn}
                    />
                </View>

                <View style={styles.information}>
                    <AppText style={styles.informationTitle}>Why BVN</AppText>
                    <AppText style={{ marginBottom: 5 }}>We only need to access your:</AppText>
                    <View style={styles.bvnItemRow}>
                        <View style={styles.smallBox} />
                        <AppText style={styles.bvnItemText}>Full name</AppText>
                    </View>
                    <View style={styles.bvnItemRow}>
                        <View style={styles.smallBox} />
                        <AppText style={styles.bvnItemText}>Phone number</AppText>
                    </View>
                    <View style={styles.bvnItemRow}>
                        <View style={styles.smallBox} />
                        <AppText style={styles.bvnItemText}>Date of birth</AppText>
                    </View>
                    <AppText style={{ marginTop: 10 }}>
                        We do not use BVN to access to your bank account nor transactions.
                    </AppText>
                </View>

                <AppButton variant="primary" label="Get BVN.. Dial *565*0#" style={styles.infoBtn} />
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
    validateBtn: {
        marginTop: 20,
    },
    information: {
        padding: 20,
        marginTop: 30,
        backgroundColor: theme.color.primary,
    },
    informationTitle: {
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#464646",
    },
    bvnItemRow: {
        marginLeft: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    bvnItemText: {
        fontSize: 14,
        marginLeft: 5,
    },
    smallBox: {
        width: 6,
        height: 6,
        borderRadius: 6,
        backgroundColor: theme.white,
    },
    infoBtn: {
        marginTop: 50,
    },
});
