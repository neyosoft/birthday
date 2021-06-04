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
import { debugAxiosError } from "../utils/request.utils";

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export default class AuthProvider extends Component {
    state = {
        user: null,
        isLoading: true,
        accessToken: null,
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
        refreshUser: async () => {
            try {
                const { data } = await axios.get("/app/user/information", {
                    baseURL: Config.SERVER_URL,
                    headers: {
                        Authorization: `Bearer ${this.state.accessToken}`,
                    },
                });

                if (data && data.email) {
                    this.setState({ user: data });
                }
            } catch (e) {}
        },
        setupCompleted: () => this.setState({ accountSetupCompleted: true }),
        setupNotCompleted: () => this.setState({ accountSetupCompleted: false }),
        authenticatedRequest: () => {
            const { accessToken } = this.state;

            const now = new Date();

            const instance = axios.create({
                baseURL: Config.SERVER_URL,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json",
                    TimeStamp: `${now.getFullYear()}-${
                        now.getMonth() + 1
                    }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`,
                },
            });

            return instance;
        },
    };

    componentDidMount() {
        this.boostrapApp();
    }

    boostrapApp = async () => {
        let user = null,
            accessToken = null,
            refreshToken = null;

        const now = new Date();

        try {
            accessToken = await getUserToken();
            refreshToken = await getRefreshToken();

            if (accessToken) {
                const { data } = await axios.get("/app/user/information", {
                    baseURL: Config.SERVER_URL,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        TimeStamp: `${now.getFullYear()}-${
                            now.getMonth() + 1
                        }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`,
                    },
                });

                if (data && data.email) {
                    user = data;
                }
            }
        } catch (e) {
            debugAxiosError(e);
        }

        const stateUpdate = { accessToken, refreshToken, user, isLoading: false };

        this.setState(stateUpdate);
    };

    render() {
        return <AuthContext.Provider value={this.state}>{this.props.children}</AuthContext.Provider>;
    }
}
