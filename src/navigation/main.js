import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Dashboard, Profile } from "../screens/main";

const Stack = createStackNavigator();

const MainApplicationNavigation = () => (
    <Stack.Navigator initialRouteName="Profile" headerMode="none">
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
);

export default MainApplicationNavigation;
