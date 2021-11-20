import { useQuery } from "react-query";
import { useQueryClient } from "react-query";
import { useToast } from "react-native-fast-toast";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import React, { useRef, useState, useEffect } from "react";
import { getYear, setYear, format, isToday } from "date-fns";
import { RFPercentage } from "react-native-responsive-fontsize";
import {
    BottomSheetModal,
    BottomSheetBackdrop,
    BottomSheetScrollView,
    BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { View, Image, Share, FlatList, StyleSheet, Dimensions, ImageBackground, TouchableOpacity } from "react-native";

import Config from "../../../config";
import { theme } from "../../../theme";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

import { useAuth } from "../../../context";
import UserOne from "../../../../assets/images/user1.png";
import { moneyFormatWNS } from "../../../utils/money.utils";
import UserAvatar from "../../../../assets/images/avatar.png";
import BirthdayIcon from "../../../../assets/images/birthday.png";
import { extractResponseErrorMessage } from "../../../utils/request.utils";
import { ReloadIcon, UserAvatarIcon, WithdrawIcon } from "../../../../assets/svg";
import { AppButton, AppText, Page, TextField, AutoFillField, PasswordField } from "../../../components";
import { MediaList } from "./components";

export const Dashboard = ({ navigation }) => {
    const { user, authenticatedRequest } = useAuth();

    const toast = useToast();
    const queryClient = useQueryClient();

    const fundWalletRef = useRef();

    const [loading, setLoading] = useState(null);

    const withdrawalRef = useRef();
    const confirmWithdrawRef = useRef();

    const [pin, setPin] = useState("");
    const [bank, setBank] = useState("");
    const [resolvedName, setResolvedName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");

    const [fundAmount, setFundAmount] = useState("");

    const wallet = useQuery("wallet", async () => {
        try {
            const { data } = await authenticatedRequest().get(`/wallet/inquiry/balance/${user.accountNumber}`);

            if (data && data.responseCode === "00") {
                return data.availableBalance;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
        }
    });

    const banks = useQuery("banks", async () => {
        try {
            const { data } = await authenticatedRequest().get("/account/banks");

            return data;
        } catch (error) {
            throw new Error();
        }
    });

    const birthdayUser = useQuery("birthdayUsers", async () => {
        try {
            const { data } = await authenticatedRequest().get(`/app/bvn/all/1/200`);

            if (data) {
                return data;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
        }
    });

    const handleInvitationShare = () => {
        Share.share(
            {
                uri: "http://pokeet.com.ng/linking",
                message: "http://pokeet.com.ng/linking/",
                title: "Share with your friends and family",
            },
            { dialogTitle: "Share with your friends and family", subject: "Share with your friends and family" },
        );
    };

    useEffect(() => {
        setResolvedName("");

        if (accountNumber.length === 10 && bank) {
            lookupAccount();
        }

        async function lookupAccount() {
            try {
                setLoading("resolving-account");
                const { data } = await authenticatedRequest().get(`/account/inquiry/${accountNumber}/${bank}`);

                if (data && data.status) {
                    setResolvedName(data.data.account_name);
                } else {
                    toast.show(data.message, { duration: 3000 });
                }
            } catch (error) {
                toast.show(extractResponseErrorMessage(error));
            } finally {
                setLoading(false);
            }
        }
    }, [accountNumber, bank]);

    const handleWithdrawal = async () => {
        if (pin.length !== 4) {
            return toast.show("You supplied invalid PIN");
        }

        try {
            setLoading("withdrawing");

            await authenticatedRequest().post("/app/user/validate/withdrawal", {
                pin,
                accountNumber,
                bankCode: bank,
                currency: "NGN",
                name: resolvedName,
                amount: withdrawAmount,
            });

            withdrawalRef.current.dismiss();
            confirmWithdrawRef.current.dismiss();

            setPin("");
            setBank("");
            setResolvedName("");
            setAccountNumber("");
            setWithdrawAmount("");

            queryClient.invalidateQueries("wallet");

            toast.show("Withdrawal is in progress...", { type: "success", duration: 3000 });

            setTimeout(() => {
                navigation.navigate("Dashboard");
            }, 1000);
        } catch (error) {
            toast.show(extractResponseErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.renderItemContainer}
            onPress={() => navigation.navigate("Donation", { profile: item, walletBalance })}>
            {item.picUrl ? (
                <Image
                    style={styles.profileImage}
                    source={
                        item.picUrl
                            ? {
                                  uri: `${
                                      Config.environment === "production"
                                          ? Config.PROD_SERVER_URL
                                          : Config.DEV_SERVER_URL
                                  }/${item.picUrl}`,
                              }
                            : UserOne
                    }
                />
            ) : (
                <UserAvatarIcon width={50} height={50} />
            )}
            <AppText style={styles.renderItemText}>{item.given_name}</AppText>
        </TouchableOpacity>
    );

    const renderBirthdayList = () => {
        if (birthdayUser.isLoading) {
            return (
                <View style={styles.centeredContent}>
                    <AppText style={styles.descriptionLabelStyle}>Loading birthday users...</AppText>
                </View>
            );
        }

        if (birthdayUser.data.length === 0) {
            return (
                <View style={styles.centeredContent}>
                    <AppText style={styles.inviteText}>Celebrants will be listed here</AppText>
                    <AppButton
                        style={styles.inviteBtn}
                        label="Invite Celebrants"
                        labelStyle={{ color: "#000" }}
                        onPress={handleInvitationShare}
                    />
                </View>
            );
        }

        return (
            <View>
                <AppText style={styles.celebrantTitle}>Explore</AppText>
                <FlatList
                    numColumns={4}
                    style={styles.flatList}
                    data={birthdayUser.data}
                    renderItem={renderItem}
                    onRefresh={birthdayUser.refetch}
                    keyExtractor={item => item.bioId}
                    refreshing={birthdayUser.isFetching}
                />
            </View>
        );
    };

    return (
        <Page>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Profile")}
                    style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={UserAvatar} style={styles.userIcon} />
                    <AppText style={styles.title}>Hi, {user.givenName}</AppText>
                </TouchableOpacity>
                <View style={styles.rightHeader}>
                    <View style={styles.rightHeaderContent}>
                        {!isToday(setYear(new Date(user.dob), getYear(new Date()))) && (
                            <AppText style={styles.shortStyle}>Your birthday is in</AppText>
                        )}
                        <AppText style={styles.birthdayCountdown}>{format(new Date(user.dob), "MMMM, dd")}</AppText>
                    </View>
                    <Image source={BirthdayIcon} />
                </View>
            </View>

            <ImageBackground
                source={require("../../../../assets/images/balance-bg.png")}
                style={styles.birthdayInformtionContainer}>
                <TouchableOpacity
                    style={styles.reloadBtn}
                    onPress={wallet.refetch}
                    disabled={wallet.isLoading || wallet.isFetching}>
                    <ReloadIcon />
                </TouchableOpacity>

                <View style={styles.balanceArea}>
                    <View style={{ alignItems: "center" }}>
                        <AppText style={styles.availableBalance}>Available Balance</AppText>
                        {wallet.isLoading || wallet.isFetching ? (
                            <AppText style={styles.walletBalance}>Loading...</AppText>
                        ) : (
                            <View style={styles.amountRow}>
                                <AppText style={{ fontSize: 12, color: "gray", margin: 6 }}>₦</AppText>
                                <AppText style={styles.walletBalance}>
                                    {moneyFormatWNS(wallet.data, 2) || "0.00"}
                                </AppText>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.actionBtnWrapper}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => {
                            if (user.pinSet) {
                                withdrawalRef.current.present();
                            } else {
                                toast.show("Kindly set transaction pin in your settings.");
                            }
                        }}>
                        <WithdrawIcon />
                        <AppText style={[styles.actionbtnText, { marginLeft: 4 }]}>Withdraw</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: theme.color.lightYello }]}
                        onPress={() => navigation.navigate("AddFund")}>
                        <AppText style={[styles.actionbtnText, { color: "#000", marginRight: 4 }]}>Add Funds</AppText>
                        <AntDesign name="plus" size={16} color="#000" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            <View style={styles.celebrantPanel}>
                <MediaList />

                <View style={{ marginTop: RFPercentage(3), flexDirection: "row" }}>
                    <AppText style={{ marginRight: 10 }}>Today’s Celebrants</AppText>
                    <Image source={require("../../../../assets/images/congratulation.png")} />
                </View>

                {renderBirthdayList()}
            </View>

            <BottomSheetModalProvider>
                <BottomSheetModal
                    index={1}
                    ref={fundWalletRef}
                    stackBehavior="push"
                    snapPoints={[-1, 300]}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    backdropComponent={BackdropComponent}
                    backgroundComponent={BackgroundComponent}
                    handleComponent={BottomSheetHandleComponent}
                    enableFlashScrollableIndicatorOnExpand={false}>
                    <View style={styles.contentContainer}>
                        <AppText style={styles.modalTitle}>Fund Wallet</AppText>

                        <TextField
                            label="Amount"
                            value={fundAmount}
                            keyboardType="numeric"
                            style={styles.formGroup}
                            onChangeText={setFundAmount}
                        />

                        <AppButton
                            label="Pay"
                            variant="secondary"
                            style={styles.submitBtn}
                            onPress={() => {
                                const theAmount = parseFloat(fundAmount) || 0;

                                if (theAmount <= 0) {
                                    return toast.show("Kindly specify amount.");
                                }

                                fundWalletRef.current.dismiss();

                                setTimeout(() => {
                                    navigation.navigate("PayWithPaystack", { amount: theAmount });
                                }, 1000);
                            }}
                        />
                    </View>
                </BottomSheetModal>

                <BottomSheetModal
                    index={1}
                    ref={withdrawalRef}
                    stackBehavior="push"
                    snapPoints={[-1, 590]}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    backdropComponent={BackdropComponent}
                    backgroundComponent={BackgroundComponent}
                    handleComponent={BottomSheetHandleComponent}
                    enableFlashScrollableIndicatorOnExpand={false}>
                    <BottomSheetScrollView style={styles.contentContainer}>
                        <AppText style={styles.modalTitle}>Withdraw Funds</AppText>
                        <View
                            style={{
                                padding: 15,
                                marginTop: 10,
                                alignItems: "center",
                                flexDirection: "row",
                                backgroundColor: "#363F34",
                                borderRadius: theme.radii.sm,
                            }}>
                            <AntDesign name="exclamationcircleo" size={24} color="#03E895" />
                            <AppText style={{ flex: 1, fontSize: 12, marginLeft: 15 }}>
                                Please note that Pokeet takes 10% from every withdrawal amount
                            </AppText>
                        </View>
                        <TextField
                            label="Amount"
                            value={withdrawAmount}
                            keyboardType="numeric"
                            style={styles.formGroup}
                            onChangeText={setWithdrawAmount}
                        />
                        <AppText style={styles.formGroup}>Select Bank</AppText>
                        <RNPickerSelect
                            value={bank}
                            onValueChange={setBank}
                            useNativeAndroidPickerStyle={false}
                            placeholder={{ label: "Select Bank", value: null }}
                            Icon={() => <Ionicons name="chevron-down" size={24} color="#fff" />}
                            items={
                                banks.isSuccess
                                    ? banks.data.map(record => ({ label: record.name, value: record.code }))
                                    : []
                            }
                            style={{
                                inputIOS: styles.dropdownInput,
                                inputAndroid: styles.dropdownInput,
                                iconContainer: { top: 25, right: 12 },
                            }}
                        />
                        <TextField
                            value={accountNumber}
                            label="Account Number"
                            keyboardType="numeric"
                            style={styles.formGroup}
                            onChangeText={setAccountNumber}
                        />

                        {loading === "resolving-account" ? (
                            <AutoFillField style={styles.formGroup} value="Resolving Account..." />
                        ) : null}

                        {resolvedName ? <AutoFillField style={styles.formGroup} value={resolvedName} /> : null}

                        <AppButton
                            label="Continue"
                            variant="secondary"
                            style={styles.submitBtn}
                            onPress={() => {
                                if (withdrawAmount < 50) {
                                    return toast.show("Withdrawal amount can not be less than 50");
                                }

                                if (!resolvedName) {
                                    return toast.show("Kindly specify an active account for withdrawal.");
                                }

                                if (!wallet.isSuccess) {
                                    return toast.show(
                                        "You available balance is not currently available. Kindly try again.",
                                    );
                                }

                                if (parseFloat(wallet.data) < parseFloat(withdrawAmount)) {
                                    return toast.show(
                                        "Your wallet balance is insufficient to perform this transaction.",
                                    );
                                }

                                confirmWithdrawRef.current.present();
                            }}
                        />
                    </BottomSheetScrollView>
                </BottomSheetModal>
                <BottomSheetModal
                    index={1}
                    stackBehavior="push"
                    ref={confirmWithdrawRef}
                    snapPoints={[-1, 350]}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    backdropComponent={BackdropComponent}
                    backgroundComponent={BackgroundComponent}
                    handleComponent={BottomSheetHandleComponent}
                    enableFlashScrollableIndicatorOnExpand={false}>
                    <View style={styles.contentContainer}>
                        <AppText style={styles.modalTitle}>Confirm Withdrawal</AppText>
                        <AppText style={styles.modalDescription}>
                            You are about to withdraw the amount of NGN{moneyFormatWNS(withdrawAmount)} to{" "}
                            {resolvedName} - {accountNumber}, {bank}
                        </AppText>

                        <PasswordField
                            value={pin}
                            label="PIN"
                            maxLength={4}
                            placeholder="X X X X"
                            onChangeText={setPin}
                            keyboardType="numeric"
                            style={styles.formGroup}
                        />

                        <AppButton
                            label="Withdraw"
                            variant="secondary"
                            style={styles.submitBtn}
                            onPress={handleWithdrawal}
                            disabled={loading === "withdrawing"}
                        />
                    </View>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </Page>
    );
};

BackdropComponent = props => (
    <BottomSheetBackdrop
        opacity={0.7}
        closeOnPress={true}
        appearsOnIndex={2}
        disappearsOnIndex={1}
        enableTouchThrough={true}
        {...props}
    />
);

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

const BackgroundComponent = ({ pointerEvents }) => (
    <View
        pointerEvents={pointerEvents}
        style={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            backgroundColor: theme.backgroundColor,
        }}
    />
);

const styles = StyleSheet.create({
    header: {
        marginTop: 20,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: {
        fontSize: RFPercentage(2),
    },
    titleIcon: {
        marginLeft: 10,
    },
    userIcon: {
        marginRight: 10,
    },
    rightHeader: {
        flexDirection: "row",
    },
    rightHeaderContent: {
        alignItems: "flex-end",
        marginRight: RFPercentage(1),
    },
    centeredContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    inviteBtn: {
        marginTop: RFPercentage(2),
        backgroundColor: theme.color.lightYello,
    },
    inviteText: {
        fontSize: 15,
        lineHeight: 20,
        textAlign: "center",
    },
    descriptionLabelStyle: {
        fontSize: 12,
        color: "gray",
        lineHeight: 20,
        textAlign: "center",
        marginTop: -RFPercentage(4),
    },
    birthdayInformtionContainer: {
        padding: 20,
        marginTop: RFPercentage(1.5),
        borderRadius: theme.radii.sm,
        backgroundColor: theme.color.primary,
    },
    reloadBtn: {
        right: RFPercentage(3),
        top: RFPercentage(2),
        position: "absolute",
    },
    balanceArea: {
        alignItems: "center",
    },
    shortStyle: {
        fontSize: 12,
        color: theme.color.yellow,
    },
    birthdayCountdown: {
        fontWeight: "700",
        fontSize: RFPercentage(2.1),
    },
    actionBtnWrapper: {
        flexDirection: "row",
        padding: RFPercentage(1),
        marginTop: RFPercentage(2),
        justifyContent: "space-between",
    },
    actionBtn: {
        width: "48%",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#494949",
        paddingVertical: RFPercentage(1.5),
    },
    actionbtnText: {
        fontSize: RFPercentage(1.8),
    },
    availableBalance: {
        fontSize: RFPercentage(1.7),
        color: theme.color.secondary,
    },
    walletBalance: {
        marginTop: 3,
        fontSize: RFPercentage(3),
    },
    amountRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    celebrantPanel: {
        flex: 1,
        padding: 25,
        paddingBottom: 0,
        marginBottom: -25,
        marginHorizontal: -25,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    celebrantTitle: {
        fontSize: 17,
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
    submitBtn: {
        marginTop: 30,
    },
    fundCard: {
        padding: 20,
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: theme.color.primary,
    },
    fundCopyText: {
        fontSize: 12,
        marginLeft: 5,
        color: "#A3A2A2",
    },
    fundBankName: {
        marginTop: 14,
        color: theme.color.yellow,
    },
    fundAccountName: {
        marginTop: 12,
    },
    fundAccountDescription: {
        fontSize: 14,
        marginTop: 20,
        color: "#F6F6F6",
        textAlign: "center",
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
    dropdownInput: {
        fontSize: 15,
        marginTop: 10,
        borderRadius: 8,
        paddingRight: 40,
        color: theme.white,
        paddingVertical: 13,
        paddingHorizontal: 20,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.color.primary,
    },
    featureDescription: {
        fontSize: 13,
        width: "80%",
        marginTop: 20,
        lineHeight: 20,
        textAlign: "center",
        alignSelf: "center",
    },
    profileImage: {
        width: 75,
        height: 75,
        borderRadius: 40,
    },
    bottomSheetInput: {
        height: 47,
        fontSize: 15,
        marginTop: 10,
        color: theme.white,
        paddingHorizontal: 20,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.color.primary,
    },
});
