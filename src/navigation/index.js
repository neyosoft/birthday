import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../context";
import AuthenticationNavigator from "./auth";
import MainApplicationNavigator from "./main";
import { View } from "react-native";
import { AppText } from "../components";

const AppNavigation = () => {
    const { isLoading, accessToken } = useAuth();

    if (isLoading) {
        return (
            <View>
                <AppText>Loading application...</AppText>
            </View>
        );
    }

    return (
        <NavigationContainer>
            {accessToken ? <MainApplicationNavigator /> : <AuthenticationNavigator />}
        </NavigationContainer>
    );
};

export default AppNavigation;
