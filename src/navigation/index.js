import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../context";
import { AppText } from "../components";
import AuthenticationNavigator from "./auth";
import MainApplicationNavigator from "./main";

const AppNavigation = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View>
                <AppText>Loading application...</AppText>
            </View>
        );
    }

    return (
        <NavigationContainer>{user ? <MainApplicationNavigator /> : <AuthenticationNavigator />}</NavigationContainer>
    );
};

export default AppNavigation;
