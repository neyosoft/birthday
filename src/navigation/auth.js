import React from "react";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";

import {
    Welcome,
    SignIn,
    VerifyOtp,
    CaptureImage,
    CreateAccount,
    VerifyDetails,
    PictureChoice,
    ForgetPassword,
    SignupDateofBirth,
} from "../screens/auth";

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
        <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
        <Stack.Screen name="CaptureImage" component={CaptureImage} />
        <Stack.Screen name="PictureChoice" component={PictureChoice} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="VerifyDetails" component={VerifyDetails} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="SignupDateofBirth" component={SignupDateofBirth} />
    </Stack.Navigator>
);

export default AuthenticationNavigator;
