import React from "react";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, TouchableOpacity, Image, Alert } from "react-native";

import { theme } from "../../theme";
import { useAuth } from "../../context";
import { AppButton, AppText, Page } from "../../components";
import { BackIcon, UserAvatarIcon } from "../../../assets/svg";
import BirthdayIcon from "../../../assets/images/birthday.png";

const extractProfileInfo = (userInfo) => {
    const output = {};

    const tier = userInfo.kyclevel;

    output.isEmailVerified = tier === "TIER2";
    output.isPhoneNumberVerified = tier === "TIER3";
    output.canUpdatePhoneNumber = tier === "TIER2";
    output.isBvnVerified = tier === "TIER4";
    output.canUpdateBvn = tier === "TIER3";

    return output;
};

export const Profile = ({ navigation }) => {
    const { user, logout } = useAuth();

    console.log("userinfo: ", user);

    const userMeta = extractProfileInfo(user);

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
                        <AppText style={styles.subtitleValue}>{user.mobileNumber}</AppText>
                    ) : (
                        <TouchableOpacity
                            onPress={() => {
                                if (userMeta.canUpdateBvn) {
                                    navigation.navigate("VerifyPhoneNumber");
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
                    <TouchableOpacity>
                        <AppText style={[styles.subtitleValue, { color: theme.color.secondary }]}>Change</AppText>
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
