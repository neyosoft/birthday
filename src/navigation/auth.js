import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Welcome, SignIn, CreateAccount, VerifyDetails, VerifyOtp } from "../screens/auth";

const Stack = createStackNavigator();

const AuthenticationNavigator = () => (
    <Stack.Navigator initialRouteName="VerifyOtp" headerMode="none">
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="VerifyDetails" component={VerifyDetails} />
    </Stack.Navigator>
);

export default AuthenticationNavigator;
