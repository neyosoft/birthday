import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useQueryClient } from "react-query";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../theme";
import { useAuth } from "../../context";
import { AppButton, AppText } from "../../components";
import Config from "../../config";

export const PayWithPaystack = ({ navigation, route }) => {
    const { user, authenticatedRequest } = useAuth();

    const queryClient = useQueryClient();

    const [status, setStatus] = useState("pending");

    const { amount } = route.params;
    const email = user.email;

    const renderHTML = () => {
        return `
        <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                
                <script src="https://js.paystack.co/v1/inline.js"></script>
                <script>
                    function payWithPaystack() {
                        var handler = PaystackPop.setup({
                            key: '${
                                Config.environment === "production" ? Config.PROD_PAYSTACK_KEY : Config.DEV_PAYSTACK_KEY
                            }',
                            email: '${email}',
                            amount: ${amount * 100},
                            currency: 'NGN',
                            ref: '' + Math.floor(Math.random() * 1000000000 + 1),
                            callback: function(response) {
                                window.ReactNativeWebView.postMessage(JSON.stringify(response))
                            },
                            onClose: function() {
                                window.ReactNativeWebView.postMessage(JSON.stringify({status: "failed"}))
                            }
                        });
                        handler.openIframe();
                    }
        
                    payWithPaystack();
                </script>
            </body>
        </html>
        `;
    };

    const handleMessage = async (event) => {
        const { data } = event.nativeEvent;

        const response = JSON.parse(data);

        switch (response.status) {
            case "success":
                try {
                    await authenticatedRequest().post("/card/tokenize", {
                        email,
                        amount,
                        refund: false,
                        reference: response.reference,
                    });
                } catch (error) {}

                queryClient.invalidateQueries("wallet");

                setStatus("successful");

                break;
            case "failed":
            default:
                setStatus("failed");
        }
    };

    if (status === "pending") {
        return (
            <WebView
                originWhitelist={["*"]}
                javaScriptEnabled={true}
                onMessage={handleMessage}
                source={{ html: renderHTML() }}
            />
        );
    } else if (status === "successful") {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.contentContainer}>
                    <View style={{ alignItems: "center", marginTop: 10, fontWeight: "600" }}>
                        <Ionicons name="checkmark-circle-outline" size={100} color="#03E895" />
                        <AppText style={{ fontSize: 20, marginTop: 15, marginBottom: 5 }}>Success</AppText>
                    </View>

                    <AppText style={styles.description}>Fund successfully completed.</AppText>

                    <AppButton
                        label="Complete"
                        variant="secondary"
                        style={styles.submitBtn}
                        onPress={() => navigation.navigate("Dashboard")}
                    />
                </View>
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.contentContainer}>
                    <View style={{ alignItems: "center", marginTop: 10, fontWeight: "600" }}>
                        <Ionicons name="close-circle-outline" size={100} color={theme.color.danger} />
                        <AppText style={{ fontSize: 20, marginTop: 15, marginBottom: 5 }}>Funding Failed.</AppText>
                    </View>

                    <AppText style={styles.description}>There is problem completing your transaction.</AppText>

                    <AppButton
                        label="Go Back"
                        variant="primary"
                        style={styles.submitBtn}
                        onPress={() => navigation.navigate("Dashboard")}
                    />
                </View>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: theme.color.primary,
    },
    contentContainer: {
        alignItems: "center",
    },
    description: {
        fontSize: 13,
    },
    submitBtn: {
        width: "80%",
        marginTop: 50,
        alignSelf: "center",
    },
});
