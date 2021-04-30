import React from "react";
import { StatusBar } from "expo-status-bar";

import { SignIn, CreateAccount } from "./screens/auth";

export default function App() {
    return (
        <>
            <StatusBar style="light" />
            <CreateAccount />
        </>
    );
}
