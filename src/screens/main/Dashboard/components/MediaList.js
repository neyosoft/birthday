import React from "react";
import { useQuery } from "react-query";
import { View, StyleSheet, FlatList } from "react-native";
import { authenticatedRequest } from "../../../../utils/request.utils";
import { AppText } from "../../../../components";

export const MediaList = () => {
    const mediaListResponse = useQuery("mediaList", async () => {
        try {
            const { data } = await authenticatedRequest().get("/media/status/all");

            return data;
        } catch (error) {
            throw new Error();
        }
    });

    if (mediaListResponse.isLoading) {
        <View>
            <AppText>Loading...</AppText>
        </View>;
    }

    if (mediaListResponse.isError) {
        <View>
            <AppText>Media listing failed.</AppText>
        </View>;
    }

    return (
        <View>
            <AppText>Loading...</AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
});
