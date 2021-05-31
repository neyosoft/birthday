import { format } from "date-fns";
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, TouchableOpacity, Image, Alert } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { theme } from "../../theme";
import { useAuth } from "../../context";
import { debugAxiosError, extractResponseErrorMessage } from "../../utils/request.utils";
import { BackIcon, UserAvatarIcon } from "../../../assets/svg";
import BirthdayIcon from "../../../assets/images/birthday.png";
import CalendarIcon from "../../../assets/images/Calendar2.png";
import { AppButton, AppText, Page, PasswordField, TextField } from "../../components";

export const Donation = ({ navigation, route }) => {
    const { user, authenticatedRequest } = useAuth();

    const donationRef = useRef();
    const confirmDonationRef = useRef();

    const { profile, walletBalance } = route.params;

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(null);
    const [donationAmount, setDonationAmount] = useState("");

    const handleDonation = async () => {
        const amount = parseFloat(donationAmount) || 0;

        if (amount <= 0) {
            return Alert.alert("Donation", "Kindly input a valid donation amount.");
        }

        try {
            setLoading("donation");

            const { data } = await authenticatedRequest().post("/app/user/validate/transaction", {
                amount,
                password,
                toUserId: profile.uid,
            });

            console.log("The response data: ", data);

            donationRef.current.dismiss();
            confirmDonationRef.current.dismiss();

            Alert.alert("Donation", "Donation successfully submitted.");
        } catch (error) {
            debugAxiosError(error);
            Alert.alert("Donation", extractResponseErrorMessage(error));
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
                {profile.family_name} {profile.given_name}
            </AppText>

            <View style={styles.form}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={BirthdayIcon} style={{ width: 20, height: 20, marginRight: 10 }} />
                    <AppText style={styles.subtitle}>{format(new Date(), "MMM, dd")}</AppText>
                </View>
                <View style={styles.separator} />
                <View>
                    <AppText style={styles.subtitle}>Donations to others</AppText>
                    <AppText style={styles.subtitleValue}>{profile.donationsVolume} Donations</AppText>
                </View>
                <View style={styles.separator} />
            </View>

            <View style={{ flex: 1 }} />

            <AppButton variant="secondary" label="Do Giveaway" onPress={() => donationRef.current.present()} />

            <BottomSheetModalProvider>
                <BottomSheetModal
                    index={1}
                    ref={donationRef}
                    stackBehavior="push"
                    snapPoints={[-1, 420]}
                    handleComponent={() => <View style={{ backgroundColor: theme.backgroundColor, height: 1 }} />}
                    backgroundComponent={({ pointerEvents }) => (
                        <View
                            pointerEvents={pointerEvents}
                            style={{
                                borderTopLeftRadius: 30,
                                borderTopRightRadius: 30,
                                backgroundColor: theme.backgroundColor,
                            }}
                        />
                    )}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    backdropComponent={(props) => <BottomSheetBackdrop opacity={0.7} {...props} />}
                    enableFlashScrollableIndicatorOnExpand={false}>
                    <View style={styles.contentContainer}>
                        <AppText style={styles.modalTitle}>Donate Funds</AppText>

                        <View style={styles.donationBalanceContainer}>
                            <View>
                                <AppText style={styles.balanceText}>Available Balance</AppText>
                                <AppText style={{ marginTop: 5 }}>NGN {walletBalance}</AppText>
                            </View>

                            <AppButton
                                style={{
                                    backgroundColor: theme.color.yellow,
                                    borderRadius: 10,
                                    paddingVertical: 8,
                                    paddingHorizontal: 10,
                                }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Ionicons name="add" size={24} color={theme.backgroundColor} />
                                    <AppText style={{ color: theme.backgroundColor, marginLeft: 5 }}>
                                        Fund Wallet
                                    </AppText>
                                </View>
                            </AppButton>
                        </View>

                        <View style={styles.donationInformationCard}>
                            <Image source={CalendarIcon} />
                            <View style={{ marginLeft: 10, flex: 1 }}>
                                <AppText>
                                    Donation to - {profile.family_name} {profile.given_name}
                                </AppText>
                                <AppText style={{ color: "#C4C4C4", marginTop: 5 }}>
                                    {format(new Date(), "MMM, dd")}
                                </AppText>
                            </View>
                        </View>

                        <TextField
                            label="Amount"
                            keyboardType="numeric"
                            value={donationAmount}
                            style={styles.formGroup}
                            onChangeText={setDonationAmount}
                        />

                        <AppButton
                            label="Proceed"
                            variant="secondary"
                            style={styles.submitBtn}
                            onPress={() => confirmDonationRef.current.present()}
                        />
                    </View>
                </BottomSheetModal>
                <BottomSheetModal
                    index={1}
                    stackBehavior="push"
                    ref={confirmDonationRef}
                    snapPoints={[-1, 350]}
                    handleComponent={() => <View style={{ backgroundColor: theme.backgroundColor, height: 1 }} />}
                    backgroundComponent={({ pointerEvents }) => (
                        <View
                            pointerEvents={pointerEvents}
                            style={{
                                borderTopLeftRadius: 30,
                                borderTopRightRadius: 30,
                                backgroundColor: theme.backgroundColor,
                            }}
                        />
                    )}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    backdropComponent={(props) => <BottomSheetBackdrop opacity={0.7} {...props} />}
                    enableFlashScrollableIndicatorOnExpand={false}>
                    <View style={styles.contentContainer}>
                        <AppText style={styles.modalTitle}>Confirm Donation</AppText>
                        <AppText style={styles.modalDescription}>
                            You are about to donate NGN {donationAmount} to {profile.family_name} {profile.given_name}{" "}
                            for their birthday
                        </AppText>

                        <PasswordField
                            label="Password"
                            value={password}
                            style={styles.formGroup}
                            onChangeText={setPassword}
                            placeholder="X X X X X X X X X X X X"
                        />

                        <AppButton
                            label="Donate"
                            variant="secondary"
                            style={styles.submitBtn}
                            onPress={handleDonation}
                            disabled={loading === "donation"}
                        />
                    </View>
                </BottomSheetModal>
            </BottomSheetModalProvider>
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
        fontSize: 20,
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
    contentContainer: {
        flex: 1,
        padding: 25,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: theme.backgroundColor,
    },
    modalTitle: {
        fontSize: 20,
    },
    modalDescription: {
        marginTop: 10,
    },
    donationBalanceContainer: {
        marginTop: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    balanceText: {
        color: "#A3A2A2",
    },
    donationInformationCard: {
        padding: 20,
        marginTop: 20,
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: theme.color.primary,
    },
    formGroup: {
        marginTop: 20,
    },
    submitBtn: {
        marginTop: 30,
    },
});
