import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "../theme";

export const Page = ({ style, children }) => {
    return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: theme.backgroundColor,
    },
});
