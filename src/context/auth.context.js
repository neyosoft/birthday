import axios from "axios";
import React, { Component, useContext } from "react";

import {
    getUserToken,
    saveUserToken,
    saveOnboarding,
    saveUserDetail,
    getRefreshToken,
    removeUserToken,
    saveRefreshToken,
    removeRefreshToken,
} from "../utils/storage.utils";
import Config from "../config";

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export default class AuthProvider extends Component {
    state = {
        user: null,
        accessToken: null,
        isLoading: true,
        refreshToken: null,
        onboardingCompleted: false,
        accountSetupCompleted: true,
        authenticate: async ({ accessToken, refreshToken, accountSetupCompleted = true }) => {
            this.setState({ isLoading: true });

            let user = null;

            await Promise.all([saveUserToken(accessToken), saveRefreshToken(refreshToken)]);

            const { data } = await axios.get("/app/user/information", {
                baseURL: Config.SERVER_URL,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (data && data.email) {
                user = data;
            }

            this.setState({
                user,
                accessToken,
                refreshToken,
                isLoading: false,
                accountSetupCompleted,
            });
        },
        updateUser: async (user) => {
            await saveUserDetail(user);

            this.setState({ user });
        },
        completeOnboarding: async () => {
            await saveOnboarding();

            this.setState({
                onboardingCompleted: true,
            });
        },
        logout: async () => {
            await Promise.all([removeUserToken(), removeRefreshToken()]);

            this.setState({
                user: null,
                getUserToken: null,
                refreshToken: null,
            });
        },
        setupNotCompleted: () => this.setState({ accountSetupCompleted: false }),
        setupCompleted: () => this.setState({ accountSetupCompleted: true }),
        authenticatedRequest: () => {
            const { accessToken } = this.state;

            const instance = axios.create({
                baseURL: Config.SERVER_URL,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json",
                },
            });

            return instance;
        },
    };

    componentDidMount() {
        this.boostrapApp();
    }

    boostrapApp = async () => {
        console.log("boostraping application");

        let accessToken = null,
            user = null,
            refreshToken = null;

        try {
            accessToken = await getUserToken();
            refreshToken = await getRefreshToken();

            if (accessToken) {
                const { data } = await axios.get("/app/user/information", {
                    baseURL: Config.SERVER_URL,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (data && data.email) {
                    user = data;
                }
            }
        } catch (e) {}

        const stateUpdate = { accessToken, refreshToken, user, isLoading: false };

        this.setState(stateUpdate);
    };

    render() {
        return <AuthContext.Provider value={this.state}>{this.props.children}</AuthContext.Provider>;
    }
}
