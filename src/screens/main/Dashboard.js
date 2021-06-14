import React, { useRef, useState, useEffect } from "react";
import { useQuery } from "react-query";
import Clipboard from "expo-clipboard";
import { useQueryClient } from "react-query";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useToast } from "react-native-fast-toast";
import RNPickerSelect from "react-native-picker-select";
import { StyleSheet, View, FlatList, Image, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { addYears, getYear, isPast, setYear, format, differenceInDays } from "date-fns";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import Config from "../../config";
import { theme } from "../../theme";

import { useAuth } from "../../context";
import UserOne from "../../../assets/images/user1.png";
import PlusIcon from "../../../assets/images/plus.png";
import CopyIcon from "../../../assets/images/copy.png";
import { moneyFormatWNS } from "../../utils/money.utils";
import UserAvatar from "../../../assets/images/avatar.png";
import BirthdayIcon from "../../../assets/images/birthday.png";
import { extractResponseErrorMessage } from "../../utils/request.utils";
import CongratulationIcon from "../../../assets/images/congratulation.png";
import { AppButton, AppText, Page, TextField, AutoFillField, PasswordField } from "../../components";

const getDurationToBirthday = (dateOfBirth) => {
    const thisYearBirthday = setYear(new Date(dateOfBirth), getYear(new Date()));

    let nextBirthday;

    if (isPast(thisYearBirthday)) {
        nextBirthday = addYears(thisYearBirthday, 1);
    } else {
        nextBirthday = thisYearBirthday;
    }

    const numberOfDays = differenceInDays(nextBirthday, new Date());

    const weeks = Math.ceil(numberOfDays / 7);
    const days = numberOfDays % 7;

    if (weeks > 0) {
        if (days > 0) {
            return `${weeks} weeks and ${days} days`;
        } else {
            return `${weeks} weeks`;
        }
    } else {
        return `${days} days`;
    }
};

export const Dashboard = ({ navigation }) => {
    const { user, authenticatedRequest } = useAuth();

    const toast = useToast();
    const queryClient = useQueryClient();

    const cardInputRef = useRef();
    const fundWalletRef = useRef();
    const confirmOtpRef = useRef();
    const fundingSuccessfulRef = useRef();

    const [loading, setLoading] = useState(null);

    const withdrawalRef = useRef();
    const upcomingFeatureRef = useRef();
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
            const { data } = await authenticatedRequest().get(`/app/bvn/all/1/100`);

            if (data) {
                return data;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
        }
    });

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

            queryClient.invalidateQueries("wallet");

            toast.show("Withdraw is in progress...", { type: "success", duration: 3000 });

            setTimeout(() => {
                navigation.navigate("Dashboard");
            }, 1000);
        } catch (error) {
            toast.show(extractResponseErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleCopyAccountNumber = async () => {
        await Clipboard.setString(user.virtualAccountNumber);

        toast.show("Account number has been copied.");
    };

    const renderBirthdayList = (walletBalance) => {
        if (birthdayUser.isLoading) {
            return (
                <View style={styles.descriptionViewStyle}>
                    <AppText style={styles.descriptionLabelStyle}>Loading birthday users...</AppText>
                </View>
            );
        }

        if (birthdayUser.data && birthdayUser.data.length === 0) {
            return (
                <View style={styles.descriptionViewStyle}>
                    <AppText style={styles.descriptionLabelStyle}>No birthday available...</AppText>
                </View>
            );
        }
        return (
            <FlatList
                numColumns={4}
                style={styles.flatList}
                data={birthdayUser.data}
                keyExtractor={(item) => item.bioId}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.renderItemContainer}
                        onPress={() => navigation.navigate("Donation", { profile: item, walletBalance })}>
                        <Image
                            style={styles.profileImage}
                            source={item.picUrl ? { uri: `${Config.SERVER_URL}/${item.picUrl}` } : UserOne}
                        />
                        <AppText style={styles.renderItemText}>{item.given_name}</AppText>
                    </TouchableOpacity>
                )}
            />
        );
    };

    return (
        <Page>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Profile")}
                        style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image source={UserAvatar} style={styles.userIcon} />
                        <AppText style={styles.title}>Hi, {user.givenName}</AppText>
                    </TouchableOpacity>
                    <Image source={CongratulationIcon} style={styles.titleIcon} />
                </View>
                <TouchableOpacity style={styles.titleRow} onPress={() => cardInputRef.current.present()}>
                    <Image source={PlusIcon} style={styles.titleIcon} />
                    <AppText style={{ marginLeft: 10 }}>Fund Wallet</AppText>
                </TouchableOpacity>
            </View>

            <View style={styles.birthdayInformtionContainer}>
                <View>
                    <AppText style={styles.shortStyle}>Your birthday is in</AppText>
                    <AppText style={styles.birthdayCountdown}>
                        {getDurationToBirthday(user.dob)} | {format(new Date(user.dob), "MMMM, dd")}
                    </AppText>
                </View>
                <Image source={BirthdayIcon} />
            </View>

            <View style={styles.walletContainer}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        wallet.refetch();
                    }}>
                    <View>
                        <AppText style={styles.availableBalance}>Available Balance</AppText>
                        <AppText style={styles.walletBalance}>
                            {wallet.isLoading || wallet.isFetching
                                ? "Loading..."
                                : `NGN ${moneyFormatWNS(wallet.data, 2) || "0.00"}`}
                        </AppText>
                    </View>
                </TouchableWithoutFeedback>

                <AppButton
                    label="Withdraw"
                    variant="secondary"
                    style={styles.withdrawBtn}
                    onPress={() => withdrawalRef.current.present()}
                />
            </View>

            <View style={styles.celebrantPanel}>
                <AppText style={styles.celebrantTitle}>Today's Celebrants</AppText>

                {renderBirthdayList(wallet.data || 0)}
            </View>

            <BottomSheetModalProvider>
                <BottomSheetModal
                    index={1}
                    stackBehavior="push"
                    ref={fundWalletRef}
                    snapPoints={[-1, 350]}
                    handleComponent={HandleComponent}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    backdropComponent={BackdropComponent}
                    backgroundComponent={BackgroundComponent}
                    enableFlashScrollableIndicatorOnExpand={false}>
                    <View style={styles.contentContainer}>
                        <AppText style={styles.modalTitle}>Fund Wallet</AppText>

                        <TouchableOpacity onPress={handleCopyAccountNumber}>
                            <View style={styles.fundCard}>
                                <View style={{ flex: 1 }}>
                                    <AppText>{user.virtualAccountNumber}</AppText>
                                    <AppText style={styles.fundAccountName}>{user.virtualAccountName}</AppText>
                                </View>
                                <View style={{ alignItems: "flex-end", width: "40%" }}>
                                    <View style={{ flexDirection: "row" }}>
                                        <Image source={CopyIcon} />
                                        <AppText style={styles.fundCopyText}>Tap to copy account number</AppText>
                                    </View>
                                    <AppText style={styles.fundBankName}>Rubies MFB</AppText>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <AppText style={styles.fundAccountDescription}>
                            You can send money to the account number above. Funds will reflect in your wallet in
                            minutes.
                        </AppText>

                        <AppButton
                            variant="secondary"
                            style={styles.submitBtn}
                            label="Fund wallet with Bank Card"
                            onPress={() => cardInputRef.current.present()}
                        />
                    </View>
                </BottomSheetModal>
                <BottomSheetModal
                    index={1}
                    ref={cardInputRef}
                    stackBehavior="push"
                    snapPoints={[-1, 300]}
                    handleComponent={HandleComponent}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    backdropComponent={BackdropComponent}
                    backgroundComponent={BackgroundComponent}
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
                                cardInputRef.current.dismiss();

                                setTimeout(() => {
                                    navigation.navigate("PayWithPaystack", { amount: fundAmount });
                                }, 1000);
                            }}
                        />
                    </View>
                </BottomSheetModal>
                <BottomSheetModal
                    index={1}
                    stackBehavior="push"
                    ref={confirmOtpRef}
                    snapPoints={[-1, 310]}
                    handleComponent={HandleComponent}
                    backgroundComponent={BackgroundComponent}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    backdropComponent={BackdropComponent}
                    enableFlashScrollableIndicatorOnExpand={false}>
                    <View style={styles.contentContainer}>
                        <AppText style={styles.modalTitle}>Confirm OTP</AppText>
                        <AppText style={styles.modalDescription}>
                            Enter OTP Code sent to 0802404xxxx to authorize this payment
                        </AppText>

                        <PasswordField label="OTP Code" style={styles.formGroup} placeholder="X X X X" />

                        <AppButton
                            label="Authorize"
                            variant="secondary"
                            style={styles.submitBtn}
                            onPress={() => {
                                fundingSuccessfulRef.current.present();
                            }}
                        />
                    </View>
                </BottomSheetModal>
                <BottomSheetModal
                    index={1}
                    stackBehavior="push"
                    snapPoints={[-1, 250]}
                    ref={fundingSuccessfulRef}
                    handleComponent={HandleComponent}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    backdropComponent={BackdropComponent}
                    backgroundComponent={BackgroundComponent}
                    enableFlashScrollableIndicatorOnExpand={false}>
                    <View style={styles.contentContainer}>
                        <View style={{ alignItems: "center", marginTop: 10, fontWeight: "600" }}>
                            <Ionicons name="checkmark-circle-outline" size={50} color="#03E895" />
                            <AppText style={{ fontSize: 20, marginTop: 15 }}>Success</AppText>
                        </View>

                        <AppButton
                            label="Dismiss"
                            variant="secondary"
                            style={styles.submitBtn}
                            onPress={() => {
                                fundingSuccessfulRef.current.dismiss();
                                cardInputRef.current.dismiss();
                                confirmOtpRef.current.dismiss();
                            }}
                        />
                    </View>
                </BottomSheetModal>

                <BottomSheetModal
                    index={1}
                    stackBehavior="push"
                    snapPoints={[-1, 220]}
                    ref={upcomingFeatureRef}
                    handleComponent={HandleComponent}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    backdropComponent={BackdropComponent}
                    backgroundComponent={BackgroundComponent}
                    enableFlashScrollableIndicatorOnExpand={false}>
                    <View style={styles.contentContainer}>
                        <AppText style={styles.modalTitle}>Withdraw Funds</AppText>

                        <AppText style={styles.featureDescription}>
                            We are currently working on this feature. Kindly check back soon!!!
                        </AppText>

                        <AppButton
                            label="Continue"
                            variant="secondary"
                            style={styles.submitBtn}
                            onPress={() => upcomingFeatureRef.current.dismiss()}
                        />
                    </View>
                </BottomSheetModal>

                <BottomSheetModal
                    index={1}
                    ref={withdrawalRef}
                    stackBehavior="push"
                    snapPoints={[-1, 590]}
                    handleComponent={HandleComponent}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    backdropComponent={BackdropComponent}
                    backgroundComponent={BackgroundComponent}
                    enableFlashScrollableIndicatorOnExpand={false}>
                    <View style={styles.contentContainer}>
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
                                    ? banks.data.map((record) => ({ label: record.name, value: record.code }))
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
                    </View>
                </BottomSheetModal>
                <BottomSheetModal
                    index={1}
                    stackBehavior="push"
                    ref={confirmWithdrawRef}
                    snapPoints={[-1, 350]}
                    handleComponent={HandleComponent}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    backdropComponent={BackdropComponent}
                    backgroundComponent={BackgroundComponent}
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

BackdropComponent = (props) => <BottomSheetBackdrop opacity={0.7} {...props} />;
const HandleComponent = () => <View style={{ backgroundColor: theme.backgroundColor, height: 1 }} />;
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
    descriptionViewStyle: {
        marginTop: 20,
    },
    descriptionLabelStyle: {
        fontSize: 12,
        color: "gray",
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
        width: 50,
        height: 50,
    },
});
