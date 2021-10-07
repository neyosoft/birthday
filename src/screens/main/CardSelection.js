import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { AntDesign, MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";

import { theme } from "../../theme";
import { AppText } from "../../components";

export const CardSelection = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navigationBar}>
                <AppText style={styles.navigationText}>Add Money</AppText>
                <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                    <AntDesign name="arrowleft" size={24} color="#91979F" />
                </TouchableOpacity>
            </View>

            <View>
                <AppText>Select account to fund from</AppText>

                <View style={styles.rowItem}>
                    <TouchableOpacity>
                        <AntDesign name="checkcircleo" size={24} color={theme.color.secondary} />
                    </TouchableOpacity>
                    <View style={styles.cardRowView}>
                        <AppText>**** 0098</AppText>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#BEBEBE" />
                </View>
                <View style={styles.rowItem}>
                    <TouchableOpacity>
                        <MaterialIcons name="radio-button-unchecked" size={30} color={theme.color.secondary} />
                    </TouchableOpacity>
                    <View style={styles.cardRowView}>
                        <AppText>**** 0098</AppText>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#BEBEBE" />
                </View>
                <TouchableOpacity style={styles.rowItem} onPress={() => navigation.navigate("AddCard")}>
                    <View>
                        <FontAwesome name="credit-card-alt" size={24} color={theme.color.secondary} />
                    </View>
                    <AppText style={{ marginLeft: RFPercentage(2) }}>Use new card</AppText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.backgroundColor,
    },
    navigationBar: {
        marginBottom: 20,
        alignItems: "center",
    },
    backIcon: {
        left: 0,
        position: "absolute",
    },
    navigationText: {
        color: theme.color.secondary,
        fontWeight: "bold",
    },

    rowItem: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: RFPercentage(3),
    },
    cardRowView: {
        flex: 1,
        marginHorizontal: RFPercentage(2),
    },
});
