import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import AuthenticationNavigator from "./auth";

const AppNavigation = () => (
    <NavigationContainer>
        <AuthenticationNavigator />
    </NavigationContainer>
);

export default AppNavigation;
