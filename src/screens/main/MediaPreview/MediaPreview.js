import React from "react";
import { SafeAreaView, View, StatusBar, Platform, Alert, Dimensions } from "react-native";
import { StoryContainer, ProgressBar } from "react-native-stories-view";

const images = [
    "https://s3.ap-south-1.amazonaws.com/hsdreams1/pins/2019/01/big/7d1e5e0b31a650b9314023921b9e161b.jpeg",
    "https://boostupliving.com/wp-content/uploads/2019/06/best-motivational-quote-mobile-wallpapers-53.jpg",
    "https://i.pinimg.com/originals/51/bd/4c/51bd4c1e72d5d6ae5f2a4f31e31d2ef5.jpg",
    "https://pumpernickelpixie.com/wp-content/uploads/2016/01/15-phone-wallpaper.jpg",
    "https://i.pinimg.com/originals/5a/f0/e5/5af0e538f7437fd13a73f7c96601ccb6.jpg",
];

import { MID_GREEN, LIGHT_GREEN, BAR_ACTIVE_COLOR, BAR_INACTIVE_COLOR, TINT_GRAY } from "./colors";

export const MediaPreview = () => {
    return (
        <View style={{ flex: 1 }}>
            {Platform.OS === "ios" && (
                <View
                    // To set the background color in IOS Status Bar also
                    style={{
                        backgroundColor: TINT_GRAY,
                        height: 45,
                    }}>
                    <StatusBar barStyle="light-content" backgroundColor={LIGHT_GREEN} />
                </View>
            )}

            {Platform.OS === "android" && <StatusBar barStyle="dark-content" backgroundColor={MID_GREEN} />}

            <SafeAreaView style={{ flex: 1 }}>
                {/* // Individual ProgressBar component */}
                <ProgressBar
                    duration={20}
                    images={images}
                    progressIndex={2}
                    onChange={() => {}}
                    enableProgress={true}
                    barStyle={{
                        barActiveColor: BAR_ACTIVE_COLOR,
                        barInActiveColor: BAR_INACTIVE_COLOR,
                        barWidth: 100, // always in number
                        barHeight: 4, // always in number
                    }}
                />
                {/* Individual Story View component */}
                <StoryContainer
                    duration={5}
                    visible={true}
                    images={images}
                    enableProgress={false}
                    containerStyle={{
                        width: "100%",
                        height: "100%",
                    }}
                    // Inbuilt User Information in header
                    userProfile={{
                        userImage: PROFILE,
                        userName: "Yuvraj Pandey",
                        userMessage: "Work hard & success will follow !!",
                        imageArrow: BACK,
                        onImageClick: () => {
                            console.log("lskndclksnc");
                            Alert.alert("User profile image tapped");
                        },
                    }}
                    // Custom Header component option
                    // headerComponent={<View />}

                    // Inbuilt Reply option  in Footer
                    replyView={{
                        isShowReply: true,
                        onReplyTextChange: (textReply, progressIndex) => {
                            console.log(`Text : ${textReply} , position : ${progressIndex}`);
                        },
                        onReplyButtonClick: (buttonType, progressIndex) => {
                            switch (buttonType) {
                                case "send":
                                    console.log(`Send button tapped for position : ${progressIndex}`);
                                    break;

                                case "smiley":
                                    console.log(`Smiley button tapped for position : ${progressIndex}`);
                                    break;
                            }
                        },
                    }}
                    // Custom Footer component option
                    // footerComponent={<View />}

                    // ProgressBar style options
                    barStyle={{
                        barActiveColor: BAR_ACTIVE_COLOR,
                        barInActiveColor: BAR_INACTIVE_COLOR,
                        barWidth: 100, // always in number
                        barHeight: 4, // always in number
                    }}
                    // Story Image style options
                    imageStyle={{
                        width: Dimensions.get("window").width, // always in number
                        height: Dimensions.get("window").height, // always in number
                    }}
                    //Callback when status view completes
                    onComplete={() => alert("onComplete")}
                />
            </SafeAreaView>
        </View>
    );
};
