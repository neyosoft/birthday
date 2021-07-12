import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ToastProvider } from "react-native-fast-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import crashlytics from "@react-native-firebase/crashlytics";

import AppNavigator from "./navigation";
import AuthProvider from "./context/auth.context";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

export default function App() {
    useEffect(() => {
        crashlytics().log("App mounted.");
    }, []);

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
