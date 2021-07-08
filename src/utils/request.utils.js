import axios from "axios";

import Config from "../config";

const instance = axios.create({
    baseURL: Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL,
});

instance.interceptors.request.use(
    function (config) {
        const now = new Date();

        config.headers.TimeStamp = `${now.getFullYear()}-${
            now.getMonth() + 1
        }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;

        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

export const baseRequest = instance;

export const authenticatedRequest = (token) => {
    const instance = axios.create({
        baseURL: Config.environment === "production" ? Config.PROD_SERVER_URL : Config.DEV_SERVER_URL,
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    instance.interceptors.request.use(
        function (config) {
            const now = new Date();

            config.headers.TimeStamp = `${now.getFullYear()}-${
                now.getMonth() + 1
            }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;

            return config;
        },
        function (error) {
            return Promise.reject(error);
        },
    );

    return instance;
};

export const extractResponseErrorMessage = (error) => {
    if (error.response) {
        return error.response.data.responseDescription;
    } else {
        return error.message;
    }
};

export const debugAxiosError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Response Data: ", error.response.data);
        console.log("Response Status: ", error.response.status);
        console.log("Response Header: ", error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log("Request: ", error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
    }

    console.log("Config: ", error.config);
};
