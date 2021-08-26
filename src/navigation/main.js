import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";

import {
    Profile,
    History,
    Donation,
    VerifyBvn,
    Dashboard,
    ChangePIN,
    PayWithPaystack,
    VerifyPhoneNumber,
    CreateTransactionPin,
} from "../screens/main";
import { theme } from "../theme";
import { HistoryIcon, HomeIcon, ProfileIcon } from "../../assets/svg";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainApplicationNavigation = () => {
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
        registerForPushNotificationsAsync();

        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            console.log("Notification: ", notification);
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("Notification tapped: ", response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const registerForPushNotificationsAsync = async () => {
        if (Constants.isDevice) {
            try {
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
            } catch (error) {
                console.log("There is problem registering device token: ", error);
            }
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

    const TabNavigator = () => (
        <Tab.Navigator
            initialRouteName="Dashboard"
            tabBarOptions={{
                labelPosition: "beside-icon",
                inactiveTintColor: "#9C9C9C",
                activeTintColor: theme.color.secondary,
                tabStyle: {
                    backgroundColor: theme.backgroundColor,
                },
            }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => {
                    if (route.name === "Profile") {
                        return <ProfileIcon color={color} />;
                    } else if (route.name === "Dashboard") {
                        return <HomeIcon color={color} />;
                    } else if (route.name === "History") {
                        return <HistoryIcon color={color} />;
                    }
                },
            })}>
            <Tab.Screen name="Dashboard" component={Dashboard} options={{ title: "Home" }} />
            <Tab.Screen name="History" component={History} />
            <Tab.Screen name="Profile" component={Profile} options={{ title: "Account" }} />
        </Tab.Navigator>
    );

    return (
        <Stack.Navigator
            headerMode="none"
            initialRouteName="Dashboard"
            screenOptions={{
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <Stack.Screen name="Donation" component={Donation} />
            <Stack.Screen name="ChangePIN" component={ChangePIN} />
            <Stack.Screen name="VerifyBvn" component={VerifyBvn} />
            <Stack.Screen name="Dashboard" component={TabNavigator} />
            <Stack.Screen name="PayWithPaystack" component={PayWithPaystack} />
            <Stack.Screen name="VerifyPhoneNumber" component={VerifyPhoneNumber} />
            <Stack.Screen name="CreateTransactionPin" component={CreateTransactionPin} />
        </Stack.Navigator>
    );
};

export default MainApplicationNavigation;
