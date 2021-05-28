import React from "react";
import { StatusBar } from "expo-status-bar";
import { ToastProvider } from "react-native-fast-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useFonts, Lato_400Regular } from "@expo-google-fonts/lato";

import AppNavigator from "./navigation";
import AuthProvider from "./context/auth.context";

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
            <ToastProvider>
                <SafeAreaProvider>
                    <StatusBar style="light" />
                    <AuthProvider>
                        <AppNavigator />
                    </AuthProvider>
                </SafeAreaProvider>
            </ToastProvider>
        </QueryClientProvider>
    );
}
