import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../context";
import { AppText } from "../components";
import AuthenticationNavigator from "./auth";
import MainApplicationNavigator from "./main";
import { theme } from "../theme";

const AppNavigation = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.color.primary,
                }}>
                <ActivityIndicator color="#fff" size="large" />
                <AppText style={{ marginTop: 20 }}>Loading application...</AppText>
            </View>
        );
    }

    return (
        <NavigationContainer>{user ? <MainApplicationNavigator /> : <AuthenticationNavigator />}</NavigationContainer>
    );
};

export default AppNavigation;
