import React, { useState } from "react";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StyleSheet, View, Image, TouchableOpacity, Platform, Alert } from "react-native";

import { BackIcon, ShieldIcon } from "../../../assets/svg";
import BirthdayIcon from "../../../assets/images/birthday.png";
import { AppText, Page, AppButton, DateField } from "../../components";
import { baseRequest, extractResponseErrorMessage } from "../../utils/request.utils";

import { theme } from "../../theme";

export const SignupDateofBirth = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(null);
    const [notification, setNotification] = useState({ visible: false, message: null });

    const { record } = route.params;

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === "ios");
        setDate(currentDate);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const accountPayload = {
                ...record,
                dob: format(date, "yyyy-MM-dd"),
                mobileNumber: parseInt(
                    record.phoneNumber.startsWith("0") ? `234${record.phoneNumber.substring(1)}` : record.phoneNumber,
                ),
            };

            delete accountPayload.phoneNumber;

            await baseRequest.post("/app/auth/signup", accountPayload);

            Alert.alert("Success", "An email has been sent to your for verification.");

            navigation.navigate("SignIn");
        } catch (error) {
            Alert.alert("Registration Failed.", extractResponseErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page>
            <TouchableOpacity style={styles.backIcon} onPress={navigation.goBack}>
                <BackIcon />
            </TouchableOpacity>
            <View style={styles.titleRow}>
                <AppText style={styles.title}>Date Of Birth</AppText>
                <Image source={BirthdayIcon} style={styles.titleIcon} />
            </View>
            <AppText style={styles.welcomeMessage}>Celebrate your birthday in style. </AppText>

            <View style={styles.form}>
                <DateField
                    label="Date of Birth"
                    placeholder="DD - MM - YY"
                    onPress={() => setShow(true)}
                    value={date ? format(new Date(date), "dd-MM-yyyy") : null}
                />
            </View>

            <View style={styles.information}>
                <View style={styles.informationHeader}>
                    <AppText style={styles.informationTitle}>Why Date of Birth</AppText>
                    <ShieldIcon style={{ borderWidth: 1 }} />
                </View>
                <View style={styles.separator}>
                    <AppText style={{ marginBottom: 5, color: "#A3A2A2" }}>
                        We only need this information so that we can:
                    </AppText>
                    <View style={styles.bvnItemRow}>
                        <View style={styles.smallBox} />
                        <AppText style={styles.bvnItemText}>Allow you to get celebrated on this day</AppText>
                    </View>
                    <View style={styles.bvnItemRow}>
                        <View style={styles.smallBox} />
                        <AppText style={styles.bvnItemText}>Profile your account</AppText>
                    </View>
                </View>

                <AppText style={{ marginTop: 10, color: "#A3A2A2" }}>
                    We will not display your date of birth to anyone
                </AppText>
            </View>

            <AppButton
                disbled={loading}
                label="Continue"
                variant="secondary"
                style={styles.continueBtn}
                onPress={handleSubmit}
            />

            {show && <DateTimePicker mode="date" value={date || new Date()} display="default" onChange={onChange} />}
        </Page>
    );
};

const styles = StyleSheet.create({
    backIcon: {
        marginVertical: 25,
    },
    titleRow: {
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
    },
    titleIcon: {
        marginLeft: 10,
        width: 25,
        height: 25,
    },
    welcomeMessage: {
        color: "#F6F6F6",
    },
    form: {
        marginTop: 30,
    },
    information: {
        flex: 1,
        padding: 20,
        marginTop: 30,
        backgroundColor: "#1D1D1D",
        borderRadius: theme.radii.sm,
    },
    informationHeader: {
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    informationTitle: {
        marginRight: 10,
    },
    bvnItemRow: {
        marginLeft: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    separator: {
        borderTopWidth: 1,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderTopColor: "#464646",
        borderBottomColor: "#464646",
    },
    bvnItemText: {
        fontSize: 14,
        marginLeft: 5,
        color: "#A3A2A2",
    },
    smallBox: {
        width: 6,
        height: 6,
        borderRadius: 6,
        backgroundColor: "#A3A2A2",
    },
    continueBtn: {
        marginTop: 100,
    },
});
