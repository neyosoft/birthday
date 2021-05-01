import React from "react";
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from "react-native";

import { theme } from "../theme";
import { AppText } from "./AppText";

export const AppButton = ({ style, textStyle, variant = "primary", label, children, ...rest }) => {
    const buttonStyle = [styles.container, style];
    const buttonTextStyle = [textStyle, styles.label];

    if (variant === "primary") {
        buttonStyle.push(styles.primaryBtn);
        buttonTextStyle.push(styles.primaryBtnLabel);
    } else if (variant === "secondary") {
        buttonStyle.push(styles.secondaryBtn);
        buttonTextStyle.push(styles.secondaryBtnLabel);
    }

    if (Platform.OS === "ios") {
        return (
            <TouchableOpacity style={buttonStyle} {...rest}>
                <View>{children ? children : <AppText style={buttonTextStyle}>{label}</AppText>}</View>
            </TouchableOpacity>
        );
    } else {
        return (
            <TouchableNativeFeedback {...rest}>
                <View style={buttonStyle}>
                    {children ? children : <AppText style={buttonTextStyle}>{label}</AppText>}
                </View>
            </TouchableNativeFeedback>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingVertical: 13,
        borderTopEndRadius: 5,
        borderRadius: theme.radii.button,
    },
    primaryBtn: {
        backgroundColor: theme.color.primary,
    },
    primaryBtnLabel: {
        color: theme.white,
    },
    secondaryBtn: {
        backgroundColor: theme.color.secondary,
    },
    secondaryBtnLabel: {
        color: theme.backgroundColor,
    },
    label: {
        fontSize: 15,
        textAlign: "center",
    },
});
