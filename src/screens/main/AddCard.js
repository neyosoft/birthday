import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, View, TouchableOpacity, TextInput } from "react-native";

import { theme } from "../../theme";
import { AppButton, AppText } from "../../components";

export const AddCard = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navigationBar}>
                <AppText style={styles.navigationText}>New Card Details</AppText>
                <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                    <AntDesign name="arrowleft" size={24} color="#91979F" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                <View style={styles.rowField}>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Card Number"
                        placeholderTextColor="#BEBEBE"
                    />
                </View>
                <View style={styles.itemRow}>
                    <View style={[styles.rowField, { width: "48%" }]}>
                        <TextInput
                            placeholder="MM/YY"
                            style={styles.input}
                            keyboardType="numeric"
                            placeholderTextColor="#BEBEBE"
                        />
                    </View>
                    <View style={{ flex: 1 }} />
                    <View style={[styles.rowField, { width: "48%" }]}>
                        <TextInput
                            placeholder="CVV"
                            style={styles.input}
                            keyboardType="numeric"
                            placeholderTextColor="#BEBEBE"
                        />
                    </View>
                </View>
                <View style={styles.rowField}>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Card PIN"
                        placeholderTextColor="#BEBEBE"
                    />
                </View>

                <View style={{ flexDirection: "row", marginTop: RFPercentage(2) }}>
                    <AntDesign name="checkcircleo" size={18} color={theme.color.yellow} />
                    <AppText style={{ marginLeft: RFPercentage(1) }}>Save card for future purpose</AppText>
                </View>
            </View>

            <AppButton label="Continue" variant="secondary" onPress={() => navigation.navigate("FundSuccessful")} />
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
    },
    rowField: {
        borderRadius: 8,
        marginTop: RFPercentage(3),
        paddingHorizontal: RFPercentage(2),
        backgroundColor: theme.color.primary,
    },
    input: {
        color: "#fff",
    },
});
