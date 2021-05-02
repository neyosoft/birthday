import React, { useRef } from "react";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { StyleSheet, View, FlatList, Image } from "react-native";

import { theme } from "../../theme";
import { AppButton, AppText, Page, TextField, AutoFillField } from "../../components";

import UserOne from "../../../assets/images/user1.png";
import PlusIcon from "../../../assets/images/plus.png";
import UserAvatar from "../../../assets/images/avatar.png";
import BirthdayIcon from "../../../assets/images/birthday.png";
import CongratulationIcon from "../../../assets/images/congratulation.png";

export const Dashboard = ({ navigation }) => {
    const bottomSheetRef = useRef();

    return (
        <Page>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Image source={UserAvatar} style={styles.userIcon} />
                    <AppText style={styles.title}>Hi, Emmanuel</AppText>
                    <Image source={CongratulationIcon} style={styles.titleIcon} />
                </View>
                <View style={styles.titleRow}>
                    <Image source={PlusIcon} style={styles.titleIcon} />
                    <AppText style={{ marginLeft: 10 }}>Fund Wallet</AppText>
                </View>
            </View>

            <View style={styles.birthdayInformtionContainer}>
                <View>
                    <AppText style={styles.shortStyle}>Your birthday is in</AppText>
                    <AppText style={styles.birthdayCountdown}>5 weeks and 3 days | August, 3</AppText>
                </View>
                <Image source={BirthdayIcon} />
            </View>

            <View style={styles.walletContainer}>
                <View>
                    <AppText style={styles.availableBalance}>Available Balance</AppText>
                    <AppText style={styles.walletBalance}>NGN0.00</AppText>
                </View>

                <AppButton
                    variant="secondary"
                    label="Withdraw"
                    style={styles.withdrawBtn}
                    onPress={() => bottomSheetRef.current.expand()}
                />
            </View>

            <View style={styles.celebrantPanel}>
                <AppText style={styles.celebrantTitle}>Today's Celebrants</AppText>

                <FlatList
                    numColumns={4}
                    style={styles.flatList}
                    data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}
                    keyExtractor={(_, index) => `index-${index}`}
                    renderItem={() => {
                        return (
                            <View style={styles.renderItemContainer}>
                                <Image source={UserOne} />
                                <AppText style={styles.renderItemText}>Damilola</AppText>
                            </View>
                        );
                    }}
                />
            </View>

            <BottomSheet
                index={0}
                ref={bottomSheetRef}
                snapPoints={[-1, "64%"]}
                handleComponent={() => <View style={{ backgroundColor: theme.backgroundColor, height: 1 }} />}
                backgroundComponent={({ pointerEvents, style }) => (
                    <View
                        pointerEvents={pointerEvents}
                        style={{
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            backgroundColor: theme.backgroundColor,
                        }}
                    />
                )}
                // enableHandlePanningGesture={false}
                // enableContentPanningGesture={false}
                backdropComponent={BottomSheetBackdrop}
                enableFlashScrollableIndicatorOnExpand={false}>
                <View style={styles.contentContainer}>
                    <AppText>Withdraw Funds</AppText>

                    <TextField style={styles.formGroup} label="Amount" />
                    <TextField style={styles.formGroup} label="Select Bank" />
                    <TextField style={styles.formGroup} label="Account Number" />
                    <AutoFillField style={styles.formGroup} value="Obagunwa Emmanuel" />

                    <AppButton
                        style={styles.formGroup}
                        variant="secondary"
                        label="Continue"
                        onPress={() => bottomSheetRef.current.close()}
                    />
                </View>
            </BottomSheet>
        </Page>
    );
};

const styles = StyleSheet.create({
    header: {
        marginVertical: 25,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 15,
    },
    titleIcon: {
        marginLeft: 10,
    },
    userIcon: {
        marginRight: 10,
    },
    birthdayInformtionContainer: {
        padding: 20,
        flexDirection: "row",
        borderRadius: theme.radii.sm,
        justifyContent: "space-between",
        backgroundColor: theme.color.primary,
    },
    shortStyle: {
        fontSize: 13,
        color: theme.color.yellow,
    },
    birthdayCountdown: {
        fontWeight: "700",
    },
    walletContainer: {
        marginTop: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    availableBalance: {
        fontSize: 13,
        color: "#A3A2A2",
    },
    walletBalance: {
        marginTop: 3,
        fontSize: 24,
        fontWeight: "700",
    },
    withdrawBtn: {
        borderRadius: 10,
        borderTopEndRadius: 10,
    },
    celebrantPanel: {
        flex: 1,
        padding: 25,
        paddingBottom: 0,
        marginTop: 40,
        marginBottom: -25,
        marginHorizontal: -25,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: theme.color.primary,
    },
    celebrantTitle: {
        marginTop: 5,
        fontWeight: "700",
    },
    flatList: {
        marginTop: 25,
    },
    renderItemContainer: {
        width: "25%",
        marginBottom: 25,
        alignItems: "center",
    },
    renderItemText: {
        fontSize: 14,
        marginTop: 10,
    },
    formGroup: {
        marginTop: 20,
    },
    contentContainer: {
        flex: 1,
        padding: 25,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: theme.backgroundColor,
    },
});
