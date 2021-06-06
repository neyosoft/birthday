import React, { useState, forwardRef } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../theme";
import { AppText } from "./AppText";

export const PasswordField = forwardRef(({ style, inputStyle, hasError, labelStyle, label, ...rest }, ref) => {
    const [show, setShow] = useState(false);

    const stateStyle = {};

    if (hasError) {
        stateStyle.borderWidth = 0.5;
        stateStyle.borderColor = "#EE3A3A";
    }

    return (
        <View style={style}>
            <AppText style={[styles.label, labelStyle]}>{label}</AppText>

            <View style={[styles.row, stateStyle]}>
                <TextInput
                    ref={ref}
                    autoCapitalize="none"
                    returnKeyType="done"
                    secureTextEntry={!show}
                    clearButtonMode="always"
                    placeholderTextColor="#A3A2A2"
                    underlineColorAndroid="transparent"
                    enablesReturnKeyAutomatically={true}
                    {...rest}
                    style={[styles.input, inputStyle]}
                />
                <TouchableOpacity onPress={() => setShow(!show)}>
                    <Ionicons name={show ? "eye-off-outline" : "eye-outline"} size={22} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
});

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
