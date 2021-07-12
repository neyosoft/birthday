import { format } from "date-fns";
import React, { useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useToast } from "react-native-fast-toast";
import crashlytics from "@react-native-firebase/crashlytics";
import { StyleSheet, View, TouchableOpacity, Image, Dimensions } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { theme } from "../../theme";
import { useAuth } from "../../context";
import { moneyFormat } from "../../utils/money.utils";
import { BackIcon, UserAvatarIcon } from "../../../assets/svg";
import BirthdayIcon from "../../../assets/images/birthday.png";
import CalendarIcon from "../../../assets/images/Calendar2.png";
import { extractResponseErrorMessage } from "../../utils/request.utils";
import { AppButton, AppText, Page, PasswordField, TextField } from "../../components";
import Config from "../../config";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

export const Donation = ({ navigation, route }) => {
    const toast = useToast();
    const pinInputRef = useRef();
    const theAmountRef = useRef();
    const queryClient = useQueryClient();
    const { user, refreshUser, authenticatedRequest } = useAuth();

    const donationRef = useRef();
    const confirmDonationRef = useRef();

    const { profile, walletBalance } = route.params;

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(null);
    const [donationAmount, setDonationAmount] = useState("");

    const handleDonation = async () => {
        if (password.length !== 4) {
            return toast.show("PIN must be four digit long.");
        }

        const amount = parseFloat(donationAmount) || 0;

        if (amount <= 0) {
            return toast.show("Kindly input a valid donation amount.");
        }

        if (amount < 100) {
            return toast.show(`Mininum donation is ${moneyFormat(100)}.`);
        }

        try {
            setLoading("donation");

            const { data } = await authenticatedRequest().post("/app/user/validate/transaction", {
                amount,
                pin: password,
                toUserId: profile.bioId,
            });

            if (data && data.responseCode === "00") {
                donationRef.current.dismiss();
                confirmDonationRef.current.dismiss();

                setPassword("");
                setDonationAmount("");

                crashlytics().log("Donation completed.");

                toast.show("You have successfully completed your donation.", { type: "success", duration: 3000 });

                queryClient.invalidateQueries("wallet");

                await refreshUser();

                setTimeout(() => {
                    navigation.navigate("Dashboard");
                }, 1000);
            } else {
                toast.show(data.responseDescription);
            }
        } catch (error) {
            crashlytics().recordError(error);
            toast.show(extractResponseErrorMessage(error));
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
                {profile.picUrl ? (
                    <Image
                        style={styles.profileImage}
                        source={{
                            uri: `${
                                Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL
                            }/${profile.picUrl}`,
                        }}
                    />
                ) : (
                    <UserAvatarIcon />
                )}
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

            <AppButton
                variant="secondary"
                label="Do Giveaway"
                onPress={() => {
                    if (user.pinSet) {
                        if (["TIER1", "TIER2"].includes(user.kyclevel)) {
                            toast.show("Kindly verify your phone number in settings before you proceed.");
                        } else {
                            donationRef?.current?.present();
                        }
                    } else {
                        toast.show("Kindly set transaction pin in your settings.");
                    }
                }}
            />

            <BottomSheetModalProvider>
                <BottomSheetModal
                    index={1}
                    ref={donationRef}
                    stackBehavior="push"
                    snapPoints={[-1, 420]}
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
                                <AppText style={{ marginTop: 5 }}>NGN {walletBalance || 0}</AppText>
                            </View>
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
                            ref={theAmountRef}
                            keyboardType="numeric"
                            value={donationAmount}
                            style={styles.formGroup}
                            onChangeText={setDonationAmount}
                        />

                        <AppButton
                            label="Proceed"
                            variant="secondary"
                            style={styles.submitBtn}
                            onPress={() => {
                                const amount = parseFloat(donationAmount) || 0;
                                const myWalletBalance = walletBalance || 0;

                                if (amount <= 0) {
                                    return toast.show("Kindly specified amount to donate.");
                                }

                                if (amount > myWalletBalance) {
                                    return toast.show("Your balance is not sufficient to complete this transaction.");
                                }
                                theAmountRef.current.blur();
                                confirmDonationRef.current.present();
                            }}
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
                    handleComponent={BottomSheetHandleComponent}
                    backdropComponent={(props) => <BottomSheetBackdrop opacity={0.7} {...props} />}
                    enableFlashScrollableIndicatorOnExpand={false}>
                    <View style={styles.contentContainer}>
                        <AppText style={styles.modalTitle}>Confirm Donation</AppText>
                        <AppText style={styles.modalDescription}>
                            You are about to donate NGN {donationAmount} to {profile.family_name} {profile.given_name}{" "}
                            for their birthday
                        </AppText>

                        <PasswordField
                            label="Pin"
                            maxLength={4}
                            value={password}
                            ref={pinInputRef}
                            placeholder="X X X X"
                            keyboardType="numeric"
                            style={styles.formGroup}
                            onChangeText={setPassword}
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

const BottomSheetHandleComponent = () => (
    <View style={{ padding: 10 }}>
        <View
            style={{
                height: 4,
                borderRadius: 4,
                alignSelf: "center",
                width: (7.5 * WINDOW_WIDTH) / 100,
                backgroundColor: theme.backgroundColor,
            }}
        />
    </View>
);

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
    profileImage: {
        width: 50,
        height: 50,
    },
});
