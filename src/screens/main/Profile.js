import React, { useState } from "react";
import { format } from "date-fns";
import Toast from "react-native-fast-toast";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, TouchableOpacity, Image, Alert } from "react-native";

import { theme } from "../../theme";
import { useAuth } from "../../context";
import { AppButton, AppText, Page } from "../../components";
import { BackIcon, UserAvatarIcon } from "../../../assets/svg";
import BirthdayIcon from "../../../assets/images/birthday.png";

const extractProfileInfo = (userInfo) => {
    const output = {};

    switch (userInfo.kyclevel) {
        case "TIER1":
            output.isEmailVerified = false;
            output.isPhoneNumberVerified = false;
            output.canUpdatePhoneNumber = false;
            output.isBvnVerified = false;
            output.canUpdateBvn = false;
            break;
        case "TIER2":
            output.isEmailVerified = true;
            output.isPhoneNumberVerified = false;
            output.canUpdatePhoneNumber = true;
            output.isBvnVerified = false;
            output.canUpdateBvn = false;
            break;
        case "TIER3":
            output.isEmailVerified = true;
            output.isPhoneNumberVerified = true;
            output.canUpdatePhoneNumber = false;
            output.isBvnVerified = false;
            output.canUpdateBvn = true;
            break;
        case "TIER4":
            output.isEmailVerified = true;
            output.isPhoneNumberVerified = true;
            output.canUpdatePhoneNumber = false;
            output.isBvnVerified = true;
            output.canUpdateBvn = false;
            break;

        default:
            output.isEmailVerified = false;
            output.isPhoneNumberVerified = false;
            output.canUpdatePhoneNumber = false;
            output.isBvnVerified = false;
            output.canUpdateBvn = false;
            break;
    }

    return output;
};

export const Profile = ({ navigation }) => {
    const { user, logout, authenticatedRequest } = useAuth();

    const [loading, setLoading] = useState(null);

    const userMeta = extractProfileInfo(user);

    console.log({ user, userMeta });

    const handlePasswordChange = async () => {
        setLoading("change-password");

        try {
            const { data } = await authenticatedRequest().post(`/app/auth/change/password/${user.email}`);

            Alert.alert("Password Reset", "Kindly check your email to complete password change.");
        } catch (error) {
            Alert.alert("Password Reset", "There is a problem changing password.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <Page>
            <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                <BackIcon />
            </TouchableOpacity>
            <AppText style={styles.title}>Profile</AppText>

            <View style={styles.avatarWrapper}>
                <UserAvatarIcon />
            </View>

            <AppText style={styles.username}>
                {user.givenName} {user.familyName}
            </AppText>

            <View style={styles.form}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={BirthdayIcon} style={{ width: 20, height: 20, marginRight: 10 }} />
                    <AppText style={styles.subtitle}>{format(new Date(user.dob), "MMMM, dd")}</AppText>
                </View>
                <View style={styles.separator} />
                <View style={styles.rowItem}>
                    <AppText style={styles.subtitle}>Donations</AppText>
                    <AppText style={styles.subtitleValue}>{user.donationVolume}</AppText>
                </View>
                <View style={styles.separator} />
                <View style={styles.rowItem}>
                    <AppText style={styles.subtitle}>Email</AppText>
                    {userMeta.isEmailVerified ? (
                        <AppText style={styles.subtitleValue}>{user.email}</AppText>
                    ) : (
                        <TouchableOpacity>
                            <AppText style={styles.invalid}>Not Verified</AppText>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.separator} />
                <View style={styles.rowItem}>
                    <AppText style={styles.subtitle}>Phone number</AppText>
                    {userMeta.isPhoneNumberVerified ? (
                        <AppText style={styles.subtitleValue}>{user.mobileNumber}</AppText>
                    ) : (
                        <TouchableOpacity
                            onPress={() => {
                                if (userMeta.canUpdatePhoneNumber) {
                                    navigation.navigate("VerifyPhoneNumber");
                                } else {
                                    Alert.alert("Verification", "You need to verify email before you proceed.");
                                }
                            }}>
                            <AppText style={styles.invalid}>Not Verified</AppText>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.separator} />
                <View style={styles.rowItem}>
                    <AppText style={styles.subtitle}>BVN</AppText>
                    {userMeta.isBvnVerified ? (
                        <AppText style={styles.subtitleValue}>{user.bvn}</AppText>
                    ) : (
                        <TouchableOpacity
                            onPress={() => {
                                if (userMeta.canUpdateBvn) {
                                    navigation.navigate("VerifyBvn");
                                } else {
                                    Alert.alert("Verification", "You need to verify phone number before you proceed.");
                                }
                            }}>
                            <AppText style={styles.invalid}>Not Verified</AppText>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.separator} />
                <View style={styles.rowItem}>
                    <AppText style={styles.subtitle}>Password</AppText>
                    <TouchableOpacity onPress={handlePasswordChange}>
                        <AppText style={[styles.subtitleValue, { color: theme.color.secondary }]}>
                            {loading === "change-password" ? "Processing..." : "Change"}
                        </AppText>
                    </TouchableOpacity>
                </View>
                <View style={styles.separator} />
                <View style={styles.rowItem}>
                    <AppText style={styles.subtitle}>About us</AppText>
                    <Ionicons name="open-outline" size={24} color="#A3A2A2" />
                </View>
            </View>

            <View style={{ flex: 1 }} />

            <AppButton label="Log out" labelStyle={styles.btnLabelStyle} onPress={logout} />
        </Page>
    );
};

const styles = StyleSheet.create({
    backIcon: {
        marginVertical: 25,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
    },
    avatarWrapper: {
        width: 60,
        height: 60,
        borderRadius: 17,
        marginVertical: 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.color.primary,
    },
    username: {
        fontWeight: "600",
    },
    form: {
        marginTop: 30,
    },
    subtitle: {
        color: "#A3A2A2",
    },
    subtitleValue: {
        color: "#fff",
        fontWeight: "700",
    },
    invalid: {
        color: "#EE3A3A",
        fontWeight: "700",
    },
    rowItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    separator: {
        height: 1,
        marginVertical: 20,
        backgroundColor: "#464646",
    },
    btnLabelStyle: {
        color: theme.color.danger,
    },
});
