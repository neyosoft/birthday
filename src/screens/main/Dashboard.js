import React, { useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { StyleSheet, View, FlatList, Image, TouchableOpacity } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { theme } from "../../theme";
import { AppButton, AppText, Page, TextField, AutoFillField, PasswordField } from "../../components";

import { useAuth } from "../../context";
import UserOne from "../../../assets/images/user1.png";
import PlusIcon from "../../../assets/images/plus.png";
import CopyIcon from "../../../assets/images/copy.png";
import UserAvatar from "../../../assets/images/avatar.png";
import BirthdayIcon from "../../../assets/images/birthday.png";
import CongratulationIcon from "../../../assets/images/congratulation.png";

export const Dashboard = ({ navigation }) => {
    const { user } = useAuth();

    const cardInputRef = useRef();
    const fundWalletRef = useRef();
    const confirmOtpRef = useRef();
    const fundingSuccessfulRef = useRef();

    const bottomSheetRef = useRef();
    const confirmWithdrawRef = useRef();

    return (
        <Page>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Profile")}
                        style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image source={UserAvatar} style={styles.userIcon} />
                        <AppText style={styles.title}>Hi, {user.given_name}</AppText>
                    </TouchableOpacity>
                    <Image source={CongratulationIcon} style={styles.titleIcon} />
                </View>
                <TouchableOpacity style={styles.titleRow} onPress={() => fundWalletRef.current.present()}>
                    <Image source={PlusIcon} style={styles.titleIcon} />
                    <AppText style={{ marginLeft: 10 }}>Fund Wallet</AppText>
                </TouchableOpacity>
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
                    onPress={() => bottomSheetRef.current.present()}
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
                            <TouchableOpacity
                                style={styles.renderItemContainer}
                                onPress={() => navigation.navigate("Donation")}>
                                <Image source={UserOne} />
                                <AppText style={styles.renderItemText}>Damilola</AppText>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            <BottomSheetModalProvider>
                <BottomSheetModal
                    index={1}
                    stackBehavior="push"
                    ref={fundWalletRef}
                    snapPoints={[-1, 310]}
                    handleComponent={HandleComponent}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    backdropComponent={BackdropComponent}
                    backgroundComponent={BackgroundComponent}
                    enableFlashScrollableIndicatorOnExpand={false}>
                    <View style={styles.contentContainer}>
                        <AppText style={styles.modalTitle}>Fund Wallet</AppText>

                        <TouchableOpacity>
                            <View style={styles.fundCard}>
                                <View>
                                    <AppText>0107724790</AppText>
                                    <AppText style={styles.fundAccountName}>Obagunwa Emmanuel</AppText>
                                </View>
                                <View style={{ alignItems: "flex-end" }}>
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
                    snapPoints={[-1, 460]}
                    handleComponent={HandleComponent}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    backdropComponent={BackdropComponent}
                    backgroundComponent={BackgroundComponent}
                    enableFlashScrollableIndicatorOnExpand={false}>
                    <View style={styles.contentContainer}>
                        <AppText style={styles.modalTitle}>Fund Wallet</AppText>

                        <TextField style={styles.formGroup} label="Amount" keyboardType="numeric" />

                        <TextField style={styles.formGroup} label="Card Number" keyboardType="numeric" />

                        <View style={styles.cardInputRow}>
                            <TextField
                                label="Expiry"
                                placeholder="MM/YY"
                                keyboardType="numeric"
                                style={styles.cardInputRowItem}
                            />

                            <TextField style={styles.cardInputRowItem} label="CVV" keyboardType="numeric" />
                        </View>

                        <AppButton
                            label="Pay"
                            variant="secondary"
                            style={styles.submitBtn}
                            onPress={() => confirmOtpRef.current.present()}
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
                                fundWalletRef.current.dismiss();
                            }}
                        />
                    </View>
                </BottomSheetModal>

                <BottomSheetModal
                    index={1}
                    stackBehavior="push"
                    ref={bottomSheetRef}
                    snapPoints={[-1, 530]}
                    handleComponent={HandleComponent}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    backdropComponent={BackdropComponent}
                    backgroundComponent={BackgroundComponent}
                    enableFlashScrollableIndicatorOnExpand={false}>
                    <View style={styles.contentContainer}>
                        <AppText style={styles.modalTitle}>Withdraw Funds</AppText>

                        <TextField style={styles.formGroup} label="Amount" keyboardType="numeric" />
                        <AppText style={styles.formGroup}>Select Bank</AppText>
                        <RNPickerSelect
                            useNativeAndroidPickerStyle={false}
                            onValueChange={(value) => console.log(value)}
                            placeholder={{ label: "Select Bank", value: null }}
                            items={[
                                { label: "UBA", value: "UBA" },
                                { label: "GTBank", value: "GTBank" },
                                { label: "Access Bank", value: "Access Bank" },
                            ]}
                            Icon={() => <Ionicons name="chevron-down" size={24} color="#fff" />}
                            style={{
                                inputIOS: styles.dropdownInput,
                                inputAndroid: styles.dropdownInput,
                                iconContainer: {
                                    top: 25,
                                    right: 12,
                                },
                            }}
                        />
                        <TextField style={styles.formGroup} label="Account Number" keyboardType="numeric" />
                        <AutoFillField style={styles.formGroup} value="Obagunwa Emmanuel" />

                        <AppButton
                            label="Continue"
                            variant="secondary"
                            style={styles.submitBtn}
                            onPress={() => confirmWithdrawRef.current.present()}
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
                            You are about to withdraw the amount of NGN20,000 to Ogunsanya Damilola - 0107724790, GTbank
                        </AppText>

                        <PasswordField
                            label="Password"
                            style={styles.formGroup}
                            placeholder="X X X X X X X X X X X X"
                        />
                        <AppText style={styles.formGroup}>Select Bank</AppText>

                        <AppButton
                            label="Withdraw"
                            variant="secondary"
                            style={styles.submitBtn}
                            onPress={() => {
                                confirmWithdrawRef.current.dismiss();
                                bottomSheetRef.current.dismiss();
                            }}
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
    cardInputRow: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cardInputRowItem: {
        width: "45%",
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
});
