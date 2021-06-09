import React, { useState, useEffect, useRef } from "react";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Text, View, Button, Platform } from "react-native";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";

import {
    Dashboard,
    Profile,
    Donation,
    VerifyBvn,
    PayWithPaystack,
    VerifyPhoneNumber,
    CreateTransactionPin,
} from "../screens/main";

const Stack = createStackNavigator();

const MainApplicationNavigation = () => {
    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => {
            setExpoPushToken(token);
        });

        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
            console.log("some notification: ", notification);
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <Stack.Navigator
            headerMode="none"
            initialRouteName="Dashboard"
            screenOptions={{
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Donation" component={Donation} />
            <Stack.Screen name="VerifyBvn" component={VerifyBvn} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="PayWithPaystack" component={PayWithPaystack} />
            <Stack.Screen name="VerifyPhoneNumber" component={VerifyPhoneNumber} />
            <Stack.Screen name="CreateTransactionPin" component={CreateTransactionPin} />
        </Stack.Navigator>
    );
};

const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();

        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            alert("Failed to get push token for push notification!");
            return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;

        setExpoPushToken(token);

        this.setState({ expoPushToken: token });
    } else {
        alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }
};

export default MainApplicationNavigation;
