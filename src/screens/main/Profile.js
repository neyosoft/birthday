import React, { useState, useRef } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "react-native-fast-toast";
import InstagramLogin from "react-native-instagram-login";
import { launchImageLibrary } from "react-native-image-picker";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, View, TouchableOpacity, Image, ScrollView, Linking, Alert } from "react-native";

import Config from "../../config";
import { theme } from "../../theme";
import { useAuth } from "../../context";
import { moneyFormat } from "../../utils/money.utils";
import { AppButton, AppText } from "../../components";
import BirthdayIcon from "../../../assets/images/birthday.png";
import { extractResponseErrorMessage } from "../../utils/request.utils";
import { BackIcon, InstagramIcon, TwitterIcon, UserAvatarIcon } from "../../../assets/svg";

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
    const instagramLoginRef = useRef();
    const { user, logout, accessToken, refreshUser, authenticatedRequest } = useAuth();

    console.log({ user });

    const [profileImage, setProfileImage] = useState(
        user.picUrl
            ? `${Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL}/${user.picUrl}`
            : null,
    );

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
        launchImageLibrary(
            {
                maxWidth: 500,
                maxHeight: 500,
                mediaType: "photo",
                saveToPhotos: false,
                includeBase64: false,
            },
            async (response) => {
                if (response.assets && response.assets.length === 1) {
                    const result = response.assets[0];

                    setProfileImage(result.uri);
                    setLoading("uploading-image");
                    const now = new Date();

                    const formdata = new FormData();
                    formdata.append("imageFile", { uri: result.uri, type: result.type, name: result.fileName });

                    try {
                        await axios.put(
                            `${
                                Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL
                            }/app/user/picture`,
                            formdata,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                    Authorization: `Bearer ${accessToken}`,
                                    TimeStamp: `${now.getFullYear()}-${
                                        now.getMonth() + 1
                                    }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`,
                                },
                            },
                        );

                        await refreshUser();
                    } catch (error) {
                        toast.show(extractResponseErrorMessage(error));
                    } finally {
                        setLoading(null);
                    }
                }
            },
        );
    };

    const submitInstragramInformation = async (instagramData) => {
        try {
            const { data } = await axios.get("https://graph.instagram.com/me", {
                params: { fields: "id,username", access_token: instagramData.access_token },
            });

            if (data && data.username) {
                await authenticatedRequest().put("/app/user/app/update", { instagram: data.username });

                toast.show("Account successfully linked.");

                refreshUser();
            }
        } catch (error) {
            toast.show("There is a problem linking your instagram account.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.backBtnArea}>
                <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                    <BackIcon />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 25, paddingTop: 5 }}>
                <View style={styles.profileHeaderRow}>
                    <TouchableOpacity style={styles.avatarWrapper} onPress={handleImageUpload}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={{ width: 60, height: 60 }} />
                        ) : (
                            <UserAvatarIcon />
                        )}
                    </TouchableOpacity>

                    <View style={{ marginLeft: RFPercentage(3) }}>
                        <AppText style={styles.username}>
                            {user.givenName} {user.familyName}
                        </AppText>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                            <Image source={BirthdayIcon} style={{ width: 17, height: 17, marginRight: 7 }} />
                            <AppText style={styles.subtitle}>{format(new Date(user.dob), "MMMM, dd")}</AppText>
                        </View>
                    </View>
                </View>

                <View style={styles.socialLinkContainer}>
                    <TouchableOpacity
                        style={styles.socialLinkItem}
                        onPress={() => Alert.alert("Twitter", "Twitter not available because of Nigeria.")}>
                        <TwitterIcon style={styles.socialLinkIcon} />
                        <AppText>Link Twitter</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialLinkItem} onPress={() => instagramLoginRef?.current?.show()}>
                        <InstagramIcon style={styles.socialLinkIcon} />
                        <AppText>{user?.instagramUsername || "Link Instagram"}</AppText>
                    </TouchableOpacity>
                </View>

                <View style={styles.separator} />
                <View style={styles.rowItem}>
                    <AppText style={styles.subtitle}>Donations</AppText>
                    <AppText style={styles.subtitleValue}>
                        {moneyFormat(user.donationsValue) || 0} ({user.donationsVolume || 0}) Total
                    </AppText>
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
                <AppText style={{ fontSize: 12, color: "gray", marginTop: 5 }}>
                    We need your BVN so we can uniquely identify genuine users on our platform, prevent fraud and so
                    your donations don’t get wasted.
                </AppText>
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
                        <TouchableOpacity onPress={() => navigation.navigate("ChangePIN")}>
                            <AppText style={[styles.subtitleValue, { color: theme.color.secondary }]}>
                                Change PIN
                            </AppText>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => navigation.navigate("CreateTransactionPin")}>
                            <AppText style={[styles.subtitleValue, { color: theme.color.secondary }]}>Set PIN</AppText>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.separator} />
                <View style={styles.rowItem}>
                    <AppText style={styles.subtitle}>App Version:</AppText>
                    <AppText style={styles.subtitleValue}>{Config.appVersion}</AppText>
                </View>
                <View style={styles.separator} />
                <View style={styles.rowItem}>
                    <AppText style={styles.subtitle}>About us</AppText>
                    <TouchableOpacity onPress={() => Linking.openURL("https://pokeet.com.ng")}>
                        <Ionicons name="open-outline" size={24} color="#A3A2A2" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={{ flex: 1, marginTop: 5 }} />

            <View style={{ marginHorizontal: 25, marginVertical: 10 }}>
                <AppButton
                    onPress={() => {
                        setLoading("logout");

                        logout();
                    }}
                    label={loading === "logout" ? "Loging out..." : "Log out"}
                />
            </View>

            <InstagramLogin
                ref={instagramLoginRef}
                appId="2995596623898286"
                scopes={["user_profile"]}
                appSecret="9dd86d435f506292c443b48917e6f32c"
                redirectUrl="https://pokeet.com.ng/instagram"
                onLoginSuccess={submitInstragramInformation}
                onLoginFailure={(data) => console.log("Login failed: ", data)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: theme.backgroundColor,
    },
    backBtnArea: {
        padding: 25,
        paddingBottom: 20,
        flexDirection: "row",
    },
    profileHeaderRow: {
        flexDirection: "row",
    },
    avatarWrapper: {
        width: 60,
        height: 60,
        borderRadius: 17,
        marginBottom: 10,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.color.primary,
    },
    username: {
        fontWeight: "600",
    },
    socialLinkContainer: {
        flexDirection: "row",
        marginVertical: RFPercentage(2),
    },
    socialLinkItem: {
        flex: 1,
        flexDirection: "row",
    },
    socialLinkIcon: {
        marginRight: RFPercentage(1),
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
});
