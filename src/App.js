import React from "react";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppNavigator from "./navigation";
import { useFonts, Lato_400Regular } from "@expo-google-fonts/lato";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

export default function App() {
    const [fontsLoaded] = useFonts({ Lato_400Regular });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <StatusBar style="light" />
                <AppNavigator />
            </SafeAreaProvider>
        </QueryClientProvider>
    );
}
