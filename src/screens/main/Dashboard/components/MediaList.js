import React from "react";
import { useQuery } from "react-query";
import { View, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";

import Config from "../../../../config";
import { useAuth } from "../../../../context";
import { AppText } from "../../../../components";
import { StoryPlusIcon } from "../../../../../assets/svg";

export const MediaList = ({ navigation }) => {
    const { user, authenticatedRequest } = useAuth();

    const mediaListResponse = useQuery("mediaList", async () => {
        try {
            const { data } = await authenticatedRequest().get("/media/status/all");

            return data;
        } catch (error) {
            throw new Error();
        }
    });

    if (mediaListResponse.isLoading) {
        return (
            <View>
                <AppText>Loading...</AppText>
            </View>
        );
    }

    if (mediaListResponse.isError) {
        return (
            <View>
                <AppText>Media listing failed.</AppText>
            </View>
        );
    }

    console.log("media list: ", mediaListResponse.data);

    return (
        <FlatList
            horizontal={true}
            style={styles.flatList}
            data={mediaListResponse.data}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.uploadersProfileUrl}
            renderItem={({ index, item }) => (
                <TouchableOpacity onPress={() => navigation.navigate("MediaPreview")}>
                    <View style={styles.storySingleContainer}>
                        <View style={styles.innerStorySingleContainer}>
                            <Image
                                resizeMode="cover"
                                style={styles.mediaUploaderImage}
                                source={{
                                    uri: `${
                                        Config.environment === "production"
                                            ? Config.PROD_SERVER_URL
                                            : Config.DEV_SERVER_URL
                                    }/${item.uploadersProfileUrl}`,
                                }}
                            />
                        </View>
                        {index === 0 ? <StoryPlusIcon style={{ position: "absolute", bottom: 7, right: -5 }} /> : null}
                    </View>
                </TouchableOpacity>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {},
    flatList: {
        marginTop: 25,
    },
    storySingleContainer: {
        width: 70,
        height: 70,
        marginRight: 15,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        backgroundColor: "#000",
        borderColor: "#03E895",
    },
    innerStorySingleContainer: {
        width: 66,
        height: 66,
        borderWidth: 4,
        borderRadius: 35,
        borderColor: "black",
        overflow: "hidden",
        backgroundColor: "#000",
    },
    mediaUploaderImage: {
        width: undefined,
        height: undefined,
        flex: 1,
    },
});
