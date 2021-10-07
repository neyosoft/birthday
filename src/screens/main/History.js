import React from "react";
import { useQuery } from "react-query";
import { formatDistanceToNow } from "date-fns";
import { useFocusEffect } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";

import { theme } from "../../theme";
import { useAuth } from "../../context";
import { AppButton, AppText } from "../../components";

import { moneyFormat } from "../../utils/money.utils";
import {
    BackIcon,
    VideoIcon,
    AudioIcon,
    CameraIcon,
    GiveAwayIcon,
    FundWalletIcon,
    WithdrawalIcon,
    GiftReceivedIcon,
} from "../../../assets/svg";

export const History = ({ navigation }) => {
    const { user, authenticatedRequest } = useAuth();

    const history = useQuery("history", async () => {
        try {
            const { data } = await authenticatedRequest().get(`/wallet/inquiry/history/${user.accountNumber}/1/200`);

            if (data && data.content) {
                return data.content;
            } else {
                throw new Error();
            }
        } catch (error) {
            throw new Error();
        }
    });

    useFocusEffect(
        React.useCallback(() => {
            history.refetch();
        }, []),
    );

    const renderTransactionRecord = ({ item: record }) => {
        switch (record.transactionType) {
            case "DEPOSIT":
                return (
                    <>
                        <View style={styles.separator} />
                        <View style={styles.eachRow}>
                            <FundWalletIcon style={styles.transactionIcon} />
                            <View style={styles.rightContainer}>
                                <AppText style={styles.subtitle}>Fund Wallet</AppText>
                                <View style={styles.textRow}>
                                    <AppText style={styles.time}>
                                        {formatDistanceToNow(new Date(record.createdAt))} ago
                                    </AppText>
                                    <AppText style={styles.description}>
                                        {" "}
                                        - You added {moneyFormat(record.amount)} to your wallet.
                                    </AppText>
                                </View>
                            </View>
                        </View>
                    </>
                );

            case "WITHDRAWAL":
                return (
                    <>
                        <View style={styles.separator} />
                        <View style={styles.eachRow}>
                            <WithdrawalIcon style={styles.transactionIcon} />
                            <View style={styles.rightContainer}>
                                <AppText style={styles.subtitle}>Withdrawal</AppText>
                                <View style={styles.textRow}>
                                    <AppText style={styles.time}>
                                        {formatDistanceToNow(new Date(record.createdAt))} ago
                                    </AppText>
                                    <AppText style={styles.description}>
                                        {" "}
                                        - You made a withdrawal of {moneyFormat(record.amount)}
                                    </AppText>
                                </View>
                            </View>
                        </View>
                    </>
                );

            case "TRANSFER":
                const isGiveAway = record.sourceAccountNumber === user.accountNumber;

                return (
                    <>
                        <View style={styles.separator} />
                        <View style={styles.eachRow}>
                            {isGiveAway ? (
                                <GiveAwayIcon style={styles.transactionIcon} />
                            ) : (
                                <GiftReceivedIcon style={styles.transactionIcon} />
                            )}

                            <View style={styles.rightContainer}>
                                <AppText style={styles.subtitle}>{isGiveAway ? "Giveaway" : "Gift Received"}</AppText>
                                <View style={styles.textRow}>
                                    <AppText style={styles.time}>
                                        {formatDistanceToNow(new Date(record.createdAt))} ago
                                    </AppText>
                                    {isGiveAway ? (
                                        <AppText style={styles.description}>
                                            {" "}
                                            - You gifted {moneyFormat(record.amount)}
                                        </AppText>
                                    ) : (
                                        <AppText style={styles.description}>
                                            {" "}
                                            - You received a gift of {moneyFormat(record.amount)}
                                        </AppText>
                                    )}
                                </View>
                                {isGiveAway ? null : (
                                    <View style={styles.thanksbox}>
                                        <AppText style={styles.thanksText}>Say Thank you now:</AppText>

                                        <View style={styles.thanksIconBox}>
                                            <TouchableOpacity>
                                                <View
                                                    style={[
                                                        styles.thankIconWrapper,
                                                        { borderColor: theme.color.yellow },
                                                    ]}>
                                                    <VideoIcon />
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <View style={[styles.thankIconWrapper, { borderColor: "#A696FB" }]}>
                                                    <AudioIcon />
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <View
                                                    style={[
                                                        styles.thankIconWrapper,
                                                        { borderColor: theme.color.secondary },
                                                    ]}>
                                                    <CameraIcon />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>
                    </>
                );
            default:
                break;
        }
        return (
            <>
                <View style={styles.separator} />
                <View style={styles.eachRow}>
                    <WithdrawalIcon />
                    <View style={styles.rightContainer}>
                        <AppText style={styles.subtitle}>Withdrawal</AppText>
                        <View style={styles.textRow}>
                            <AppText style={styles.time}>2 mins ago</AppText>
                            <AppText style={styles.description}>
                                {" "}
                                - You made a withdrawal of {moneyFormat(record.amount)}
                            </AppText>
                        </View>
                    </View>
                </View>
            </>
        );
    };

    const renderContent = () => {
        if (history.isLoading) {
            return (
                <View style={styles.centerView}>
                    <AppText>Loading history...</AppText>
                </View>
            );
        }

        if (history.isError) {
            return (
                <View style={styles.centerView}>
                    <AppText>There is problem retrieving history.</AppText>

                    <AppButton label="Try again." onPress={history.refetch} />
                </View>
            );
        }

        return (
            <FlatList
                data={history.data}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderTransactionRecord}
                contentContainerStyle={{ padding: 25, paddingTop: 5 }}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.backBtnArea}>
                <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                    <BackIcon />
                </TouchableOpacity>
            </View>

            <AppText style={styles.title}>History</AppText>

            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: theme.backgroundColor,
    },
    title: {
        paddingHorizontal: 20,
        fontSize: RFPercentage(2.3),
        marginBottom: RFPercentage(2),
    },
    centerView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    backBtnArea: {
        padding: 25,
        paddingBottom: 20,
        flexDirection: "row",
    },
    eachRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    rightContainer: {
        flex: 1,
        marginLeft: RFPercentage(1),
    },
    transactionIcon: {
        margin: RFPercentage(1),
    },
    subtitle: {
        fontSize: 15,
    },
    textRow: {
        marginTop: 3,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    time: {
        fontSize: 11,
        color: theme.color.secondary,
    },
    description: {
        fontSize: 11,
        color: "#A3A2A2",
    },
    separator: {
        height: 1,
        marginVertical: 20,
        backgroundColor: "#464646",
    },
    thanksbox: {
        marginTop: RFPercentage(1),
    },
    thanksText: {
        color: "#fff",
        fontSize: RFPercentage(1.5),
    },
    thanksIconBox: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: RFPercentage(1),
    },
    thankIconWrapper: {
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
        width: RFPercentage(5),
        height: RFPercentage(5),
        marginRight: RFPercentage(2),
        borderRadius: RFPercentage(5),
    },
});
