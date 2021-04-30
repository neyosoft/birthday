import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { theme } from "../theme";
import { AppText } from "./AppText";

export const TextField = ({ style, inputStyle, labelStyle, label, ...rest }) => (
    <View style={style}>
        <AppText style={[styles.label, labelStyle]}>{label}</AppText>

        <TextInput
            returnKeyType="done"
            clearButtonMode="always"
            placeholderTextColor="#A3A2A2"
            underlineColorAndroid="transparent"
            enablesReturnKeyAutomatically={true}
            {...rest}
            style={[styles.input, inputStyle]}
        />
    </View>
);

const styles = StyleSheet.create({
    label: {},
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
