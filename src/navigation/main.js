import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Dashboard, Profile, Donation, PayWithPaystack } from "../screens/main";

const Stack = createStackNavigator();

const MainApplicationNavigation = () => (
    <Stack.Navigator initialRouteName="Dashboard" headerMode="none">
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Donation" component={Donation} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="PayWithPaystack" component={PayWithPaystack} />
    </Stack.Navigator>
);

export default MainApplicationNavigation;
