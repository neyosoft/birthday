import React from "react";
import { AppLoading } from "expo";
import { StatusBar } from "expo-status-bar";

import AppNavigator from "./navigation";
import { useFonts, Lato_400Regular } from "@expo-google-fonts/lato";

export default function App() {
    const [fontsLoaded] = useFonts({ Lato_400Regular });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <>
            <StatusBar style="light" />
            <AppNavigator />
        </>
    );
}
