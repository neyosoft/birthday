import React from "react";
import { Text, StyleSheet } from "react-native";

export const AppText = ({ children, style, ...rest }) => (
    <Text style={[styles.container, style]} {...rest}>
        {children}
    </Text>
);

const styles = StyleSheet.create({
    container: {
        fontSize: 15,
        color: "#fff",
        fontFamily: "Lato_400Regular",
    },
});
