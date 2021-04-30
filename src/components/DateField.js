import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";

import { theme } from "../theme";
import { AppText } from "./AppText";
import CalendarIcon from "../../assets/images/calendar.png";

export const DateField = ({ style, inputStyle, labelStyle, label, value, placeholder }) => (
    <View style={style}>
        <AppText style={[styles.label, labelStyle]}>{label}</AppText>

        <View style={styles.row}>
            <AppText style={[styles.input, inputStyle]}>{value || placeholder}</AppText>
            <TouchableOpacity onPress={() => {}}>
                <Image source={CalendarIcon} />
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    label: {},
    row: {
        marginTop: 10,
        paddingVertical: 13,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.color.primary,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: theme.white,
    },
});
