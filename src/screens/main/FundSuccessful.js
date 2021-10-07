import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";

import { FundSuccessIcon } from "../../../assets/svg";

import { theme } from "../../theme";
import { AppButton, AppText } from "../../components";

export const FundSuccessful = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <FundSuccessIcon />
            <View style={styles.centeredText}>
                <AppText style={styles.title}>Success</AppText>
                <AppText style={styles.subtitle}>You have successfully added money to your wallet</AppText>
            </View>

            <AppButton
                variant="secondary"
                style={styles.button}
                label="Return to Dashboard"
                onPress={() => navigation.navigate("Dashboard")}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.backgroundColor,
    },
    centeredText: {
        width: "70%",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "#fff",
        fontWeight: "bold",
        marginTop: RFPercentage(4),
        fontSize: RFPercentage(2.5),
    },
    subtitle: {
        textAlign: "center",
        color: "#BEBEBE",
        marginTop: RFPercentage(2),
        lineHeight: RFPercentage(3),
    },
    button: {
        marginTop: RFPercentage(5),
    },
});
