import React from "react";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";

import { Welcome, SignIn, CreateAccount, ForgetPassword, SignupDateofBirth } from "../screens/auth";

const Stack = createStackNavigator();

const AuthenticationNavigator = () => (
    <Stack.Navigator
        headerMode="none"
        initialRouteName="Welcome"
        screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="SignupDateofBirth" component={SignupDateofBirth} />
    </Stack.Navigator>
);

export default AuthenticationNavigator;
