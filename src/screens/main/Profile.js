import React, { useState } from "react";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "react-native-fast-toast";
import { StyleSheet, View, TouchableOpacity, Image, Platform, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";

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
    const toast = useToast();

    const { user, logout, authenticatedRequest } = useAuth();
    const [profileImage, setProfileImage] = useState(user.picUrl);

    const [loading, setLoading] = useState(null);

    const userMeta = extractProfileInfo(user);

    const handlePasswordChange = async () => {
        setLoading("change-password");

        try {
            await authenticatedRequest().post(`/app/auth/change/password/${user.email}`);

            toast.show("Kindly check your email to complete password change.");
        } catch (error) {
            toast.show("There is a problem changing password.");
        } finally {
            setLoading(null);
        }
    };

    const handleImageUpload = async () => {
        if (Platform.OS !== "web") {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== "granted") {
                toast.show("Sorry, we need camera roll permissions to change profile picture.", { type: "danger" });
            } else {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1,
                });

                if (!result.cancelled) {
                    setProfileImage(result.uri);
                }
            }
        }
    };

    return (
        <Page>
            <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                <BackIcon />
            </TouchableOpacity>
            <AppText style={styles.title}>Profile</AppText>

            <TouchableOpacity style={styles.avatarWrapper} onPress={handleImageUpload}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={{ width: 60, height: 60 }} />
                ) : (
                    <UserAvatarIcon />
                )}
            </TouchableOpacity>

            <AppText style={styles.username}>
                {user.givenName} {user.familyName}
            </AppText>

            <ScrollView style={styles.form}>
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
                                    toast.show("You need to verify email before you proceed.");
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
                                    toast.show("You need to verify phone number before you proceed.");
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
                    <AppText style={styles.subtitle}>PIN</AppText>
                    {user.pinSet ? (
                        <AppText style={styles.subtitleValue}>******</AppText>
                    ) : (
                        <TouchableOpacity onPress={() => navigation.navigate("CreateTransactionPin")}>
                            <AppText style={[styles.subtitleValue, { color: theme.color.secondary }]}>Set PIN</AppText>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.separator} />
                <View style={styles.rowItem}>
                    <AppText style={styles.subtitle}>About us</AppText>
                    <Ionicons name="open-outline" size={24} color="#A3A2A2" />
                </View>
            </ScrollView>

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
        overflow: "hidden",
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
