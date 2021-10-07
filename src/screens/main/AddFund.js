import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useToast } from "react-native-fast-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, View, TouchableOpacity, TextInput } from "react-native";

import { theme } from "../../theme";
import { AppButton, AppText } from "../../components";

export const AddFund = ({ navigation }) => {
    const toast = useToast();

    const [amount, setAmount] = useState(null);
    const [showCustomerInput, setShowCustomInput] = useState(false);

    const renderDefaultAmountSelection = () => (
        <View>
            <View style={styles.itemRow}>
                <TouchableOpacity onPress={() => setAmount(500)}>
                    <View style={[styles.amountbox, { borderColor: amount === 500 ? "#FEC65A" : theme.color.primary }]}>
                        <AppText style={[styles.amountText, { color: amount === 500 ? "#fff" : "#BEBEBE" }]}>
                            ₦500
                        </AppText>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setAmount(1000)}>
                    <View
                        style={[styles.amountbox, { borderColor: amount === 1000 ? "#FEC65A" : theme.color.primary }]}>
                        <AppText style={[styles.amountText, { color: amount === 1000 ? "#fff" : "#BEBEBE" }]}>
                            ₦1k
                        </AppText>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setAmount(2000)}>
                    <View
                        style={[styles.amountbox, { borderColor: amount === 2000 ? "#FEC65A" : theme.color.primary }]}>
                        <AppText style={[styles.amountText, { color: amount === 2000 ? "#fff" : "#BEBEBE" }]}>
                            ₦2k
                        </AppText>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.itemRow}>
                <TouchableOpacity onPress={() => setAmount(5000)}>
                    <View
                        style={[styles.amountbox, { borderColor: amount === 5000 ? "#FEC65A" : theme.color.primary }]}>
                        <AppText style={[styles.amountText, { color: amount === 5000 ? "#fff" : "#BEBEBE" }]}>
                            ₦5k
                        </AppText>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setAmount(10000)}>
                    <View
                        style={[styles.amountbox, { borderColor: amount === 10000 ? "#FEC65A" : theme.color.primary }]}>
                        <AppText style={[styles.amountText, { color: amount === 10000 ? "#fff" : "#BEBEBE" }]}>
                            ₦10k
                        </AppText>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setAmount("");
                        setShowCustomInput(true);
                    }}>
                    <View
                        style={[
                            styles.amountbox,
                            { borderColor: amount === "custom" ? "#FEC65A" : theme.color.primary },
                        ]}>
                        <AppText style={[styles.amountText, { color: amount === "custom" ? "#fff" : "#BEBEBE" }]}>
                            Custom
                        </AppText>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    const handlePaymentConfirmation = () => {
        const realAmount = Number(amount) || 0;

        if (!realAmount) {
            return toast.show("Amount not specified.");
        }

        if (realAmount <= 0) {
            return toast.show("Amount must be greater than 0");
        }

        navigation.navigate("FundConfirmation", { amount: realAmount });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navigationBar}>
                <AppText style={styles.navigationText}>Add Money</AppText>
                <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                    <AntDesign name="arrowleft" size={24} color="#91979F" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                <AppText>How much will you like to fund?</AppText>

                {showCustomerInput ? (
                    <View style={styles.customInputContainer}>
                        <TextInput
                            value={amount}
                            keyboardType="numeric"
                            onChangeText={setAmount}
                            placeholder="Enter amount"
                            style={styles.amountInput}
                            placeholderTextColor="#333"
                        />
                    </View>
                ) : (
                    renderDefaultAmountSelection()
                )}
            </View>

            <AppButton variant="secondary" label="Pay" onPress={handlePaymentConfirmation} />
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
    itemRow: {
        flexDirection: "row",
        marginTop: RFPercentage(3),
        justifyContent: "space-between",
    },
    amountbox: {
        borderRadius: 10,
        borderWidth: 2,
        alignItems: "center",
        width: RFPercentage(14),
        height: RFPercentage(10),
        justifyContent: "center",
        borderColor: theme.color.primary,
        backgroundColor: theme.color.primary,
    },
    amountText: {
        color: "#BEBEBE",
        fontWeight: "bold",
        fontSize: RFPercentage(2.4),
    },
    customInputContainer: {
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "#fff",
        marginTop: RFPercentage(2),
        paddingHorizontal: RFPercentage(2),
    },
    amountInput: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: RFPercentage(3),
    },
});
