import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

import { theme } from "../theme";
import { AppText } from "./AppText";

export const AutoFillField = ({ style, inputStyle, labelStyle, value, ...rest }) => (
    <View style={[styles.container, style]}>
        <AppText style={[styles.label, labelStyle]}>{value}</AppText>
        <Ionicons name="checkmark-circle-outline" size={24} color={theme.color.secondary} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        paddingVertical: 13,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        borderRadius: theme.radii.sm,
        borderColor: theme.color.secondary,
    },
    label: {
        flex: 1,
    },

    input: {
        fontSize: 15,
        marginTop: 10,
        color: theme.white,
        paddingVertical: 13,
        paddingHorizontal: 20,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.color.primary,
    },
});
