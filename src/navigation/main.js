import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Dashboard } from "../screens/main";

const Stack = createStackNavigator();

const MainApplicationNavigation = () => (
    <Stack.Navigator initialRouteName="Dashboard" headerMode="none">
        <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
);

export default MainApplicationNavigation;
