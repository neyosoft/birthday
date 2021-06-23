import React from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from "react-native";

import { theme } from "../theme";
import { AppText } from "./AppText";

export const AppButton = ({ style, labelStyle, variant = "primary", label, children, ...rest }) => {
    const buttonStyle = [styles.container];
    const buttonTextStyle = [styles.label];

    if (variant === "primary") {
        buttonStyle.push(styles.primaryBtn);
        buttonTextStyle.push(styles.primaryBtnLabel);
    } else if (variant === "secondary") {
        buttonStyle.push(styles.secondaryBtn);
        buttonTextStyle.push(styles.secondaryBtnLabel);
    }

    buttonStyle.push(style);
    buttonTextStyle.push(labelStyle);

    if (rest.disabled) {
        buttonStyle.push(styles.disabledBtn);
        buttonTextStyle.push(styles.disabledBtnLabel);
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
        padding: RFPercentage(2.7),
        paddingVertical: RFPercentage(1.8),
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
    disabledBtn: {
        backgroundColor: "#999",
    },
    disabledBtnLabel: {
        color: "#ddd",
    },
});
