import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { theme } from "../../theme";
import { AppButton, AppText } from "../../components";
import { moneyFormatWNS } from "../../utils/money.utils";

export const FundConfirmation = ({ navigation, route }) => {
    const { amount } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navigationBar}>
                <AppText style={styles.navigationText}>Add Money</AppText>
                <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                    <AntDesign name="arrowleft" size={24} color="#91979F" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, alignItems: "center" }}>
                <AppText>How much will you like to fund?</AppText>

                <View style={styles.rowItem}>
                    <AppText style={styles.raisedAmountIcon}>₦</AppText>
                    <AppText style={styles.amount}>{moneyFormatWNS(amount, 2) || "0.00"}</AppText>
                </View>
            </View>

            <AppButton
                label="Pay"
                variant="secondary"
                onPress={() => navigation.navigate("CardSelection", { amount })}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.backgroundColor,
    },
    navigationBar: {
        marginBottom: 20,
        alignItems: "center",
    },
    backIcon: {
        left: 0,
        position: "absolute",
    },
    navigationText: {
        color: theme.color.secondary,
        fontWeight: "bold",
    },
    raisedAmountIcon: {
        margin: 4,
        color: "#BEBEBE",
        fontSize: RFPercentage(2.4),
    },
    amount: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: RFPercentage(4),
    },
    rowItem: {
        flexDirection: "row",
        marginTop: RFPercentage(2),
    },
});
