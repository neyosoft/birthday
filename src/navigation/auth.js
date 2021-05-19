import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import {
    Welcome,
    SignIn,
    CreateAccount,
    VerifyDetails,
    VerifyOtp,
    PictureChoice,
    CaptureImage,
    SignupDateofBirth,
} from "../screens/auth";

const Stack = createStackNavigator();

const AuthenticationNavigator = () => (
    <Stack.Navigator initialRouteName="Welcome" headerMode="none">
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
        <Stack.Screen name="CaptureImage" component={CaptureImage} />
        <Stack.Screen name="PictureChoice" component={PictureChoice} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="VerifyDetails" component={VerifyDetails} />
        <Stack.Screen name="SignupDateofBirth" component={SignupDateofBirth} />
    </Stack.Navigator>
);

export default AuthenticationNavigator;
