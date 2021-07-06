import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { Component, useContext } from "react";
import crashlytics from "@react-native-firebase/crashlytics";

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
import { isFuture } from "date-fns";

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
            const params = new URLSearchParams();

            params.append("client_id", "api-access");
            params.append("refresh_token", this.state.refreshToken);
            params.append("client_secret", "977d186a-095b-4705-a1cb-26b774fce3e1");

            try {
                await axios.post("/auth/realms/vibes/protocol/openid-connect/logout", params, {
                    baseURL: Config.SERVER_URL,
                    headers: {
                        Authorization: `Bearer ${this.state.accessToken}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });
            } catch (error) {}

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
                    await saveUserDetail(data);
                    this.setState({ user: data });
                }
            } catch (e) {}
        },
        setupCompleted: () => this.setState({ accountSetupCompleted: true }),
        setupNotCompleted: () => this.setState({ accountSetupCompleted: false }),
        authenticatedRequest: () => {
            const { accessToken, refreshToken } = this.state;

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

            instance.interceptors.request.use(async (config) => {
                const decoded = jwt_decode(accessToken);

                if (isFuture(new Date(decoded.exp * 1000))) {
                    return config;
                } else {
                    const params = new URLSearchParams();

                    params.append("refresh_token", refreshToken);
                    params.append("client_id", "api-access");
                    params.append("grant_type", "refresh_token");
                    params.append("client_secret", "977d186a-095b-4705-a1cb-26b774fce3e1");

                    const { data } = await axios.post("/auth/realms/vibes/protocol/openid-connect/token", params, {
                        baseURL: Config.SERVER_URL,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            TimeStamp: `${now.getFullYear()}-${
                                now.getMonth() + 1
                            }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`,
                        },
                    });

                    if (data && data.access_token && data.refresh_token) {
                        await Promise.all([saveUserToken(data.access_token), saveRefreshToken(data.refresh_token)]);
                        this.setState({ accessToken: data.access_token, refreshToken: data.refresh_token });

                        config.headers["Authorization"] = "Bearer " + data.access_token;

                        return config;
                    }
                }
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
                const decoded = jwt_decode(accessToken);

                if (isFuture(new Date(decoded.exp * 1000))) {
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
                } else {
                    const params = new URLSearchParams();

                    params.append("refresh_token", refreshToken);
                    params.append("client_id", "api-access");
                    params.append("grant_type", "refresh_token");
                    params.append("client_secret", "977d186a-095b-4705-a1cb-26b774fce3e1");

                    const { data } = await axios.post("/auth/realms/vibes/protocol/openid-connect/token", params, {
                        baseURL: Config.SERVER_URL,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            TimeStamp: `${now.getFullYear()}-${
                                now.getMonth() + 1
                            }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`,
                        },
                    });

                    if (data && data.access_token && data.refresh_token) {
                        this.setState({ isLoading: true });

                        accessToken = data.access_token;
                        refreshToken = data.refresh_token;

                        await Promise.all([saveUserToken(accessToken), saveRefreshToken(refreshToken)]);

                        const { data: userData } = await axios.get("/app/user/information", {
                            baseURL: Config.SERVER_URL,
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        });

                        if (userData && userData.email) {
                            user = userData;

                            crashlytics().setAttributes(userData);
                        }

                        this.setState({
                            user,
                            accessToken,
                            refreshToken,
                            isLoading: false,
                        });
                    }
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
