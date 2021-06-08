import React, { useRef } from "react";
import * as Analytics from "expo-firebase-analytics";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../context";
import { AppText } from "../components";
import AuthenticationNavigator from "./auth";
import MainApplicationNavigator from "./main";
import { theme } from "../theme";

const AppNavigation = () => {
    const { user, isLoading } = useAuth();

    const navigationRef = useRef();
    const routeNameRef = useRef();

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
        <NavigationContainer
            ref={navigationRef}
            onReady={() => (routeNameRef.current = navigationRef.current.getCurrentRoute().name)}
            onStateChange={async () => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName = navigationRef.current.getCurrentRoute().name;

                if (previousRouteName !== currentRouteName) {
                    await Analytics.setCurrentScreen(currentRouteName);
                }

                // Save the current route name for later comparison
                routeNameRef.current = currentRouteName;
            }}>
            {user ? <MainApplicationNavigator /> : <AuthenticationNavigator />}
        </NavigationContainer>
    );
};

export default AppNavigation;
