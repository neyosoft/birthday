import React from "react";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";

import { Dashboard, Profile, Donation, PayWithPaystack, VerifyPhoneNumber } from "../screens/main";

const Stack = createStackNavigator();

const MainApplicationNavigation = () => (
    <Stack.Navigator
        headerMode="none"
        initialRouteName="Dashboard"
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Donation" component={Donation} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="PayWithPaystack" component={PayWithPaystack} />
        <Stack.Screen name="VerifyPhoneNumber" component={VerifyPhoneNumber} />
    </Stack.Navigator>
);

export default MainApplicationNavigation;
