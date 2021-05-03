import React, { useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { theme } from "../../theme";
import { AppButton, AppText, Page, PasswordField, TextField } from "../../components";
import { BackIcon, UserAvatarIcon } from "../../../assets/svg";
import BirthdayIcon from "../../../assets/images/birthday.png";
import CalendarIcon from "../../../assets/images/Calendar2.png";

export const Donation = ({ navigation }) => {
    const donationRef = useRef();
    const confirmDonationRef = useRef();

    return (
        <Page>
            <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                <BackIcon />
            </TouchableOpacity>
            <AppText style={styles.title}>Profile</AppText>

            <View style={styles.avatarWrapper}>
                <UserAvatarIcon />
            </View>

            <AppText style={styles.username}>Obagunwa Emmanuel</AppText>

            <View style={styles.form}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={BirthdayIcon} style={{ width: 20, height: 20, marginRight: 10 }} />
                    <AppText style={styles.subtitle}>April, 10</AppText>
                </View>
                <View style={styles.separator} />
                <View>
                    <AppText style={styles.subtitle}>Donations to others</AppText>
                    <AppText style={styles.subtitleValue}>200 Donations</AppText>
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
                                <AppText style={{ marginTop: 5 }}>NGN0.00</AppText>
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
                                <AppText>Donation to - Ogunsanya Damilola</AppText>
                                <AppText style={{ color: "#C4C4C4", marginTop: 5 }}>April, 10</AppText>
                            </View>
                        </View>

                        <TextField style={styles.formGroup} label="Amount" keyboardType="numeric" />

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
                            You are about to donate NGN20,000 to Ogunsanya Damilola for their birthday
                        </AppText>

                        <PasswordField
                            label="Password"
                            style={styles.formGroup}
                            placeholder="X X X X X X X X X X X X"
                        />
                        <AppText style={styles.formGroup}>Select Bank</AppText>

                        <AppButton
                            label="Donate"
                            variant="secondary"
                            style={styles.submitBtn}
                            onPress={() => {
                                donationRef.current.dismiss();
                                confirmDonationRef.current.dismiss();
                            }}
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
