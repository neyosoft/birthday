import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from "react-native";

import { theme } from "../../theme";
import { AppText, Page } from "../../components";
import SmileIcon from "../../../assets/images/smile.png";
import PicureIcon from "../../../assets/images/picture.png";
import { BackIcon, BarcodeScan } from "../../../assets/svg";

export const PictureChoice = ({ navigation }) => {
    return (
        <Page>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                    <BackIcon />
                </TouchableOpacity>
                <View style={styles.titleRow}>
                    <AppText style={styles.title}>Profile Picture</AppText>
                    <Image source={SmileIcon} style={styles.titleIcon} />
                </View>

                <AppText style={styles.welcomeMessage}>
                    Take a selfie or upload a profile picture to validate your account.
                </AppText>

                <View style={styles.form}>
                    <TouchableOpacity style={styles.optionContainer}>
                        <BarcodeScan />
                        <AppText style={styles.optionTextStyle}>Take a selfie picture</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionContainer}>
                        <Image source={PicureIcon} />
                        <AppText style={styles.optionTextStyle}>Upload a profile picture</AppText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Page>
    );
};

const styles = StyleSheet.create({
    backIcon: {
        marginVertical: 25,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
    },
    titleIcon: {
        marginLeft: 10,
    },
    welcomeMessage: {
        color: "#F6F6F6",
    },
    form: {
        marginTop: 30,
    },
    optionContainer: {
        marginBottom: 20,
        paddingVertical: 30,
        alignItems: "center",
        borderRadius: theme.radii.sm,
        backgroundColor: theme.color.primary,
    },
    optionTextStyle: {
        color: "#A3A2A2",
        marginTop: 10,
    },
});
