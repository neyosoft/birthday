import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_TOKEN_KEY = "userToken";
const USER_DETAIL_KEY = "userDetail";
const USER_REFRESH_TOKEN_KEY = "userRefreshToken";
const ONBOARDING_COMPLETED = "ONBOARDING_COMPLETED";

export const saveUserToken = (token) => AsyncStorage.setItem(USER_TOKEN_KEY, token);
export const getUserToken = () => AsyncStorage.getItem(USER_TOKEN_KEY);
export const removeUserToken = () => AsyncStorage.removeItem(USER_TOKEN_KEY);

export const saveRefreshToken = (token) => AsyncStorage.setItem(USER_REFRESH_TOKEN_KEY, token);
export const getRefreshToken = () => AsyncStorage.getItem(USER_REFRESH_TOKEN_KEY);
export const removeRefreshToken = () => AsyncStorage.removeItem(USER_REFRESH_TOKEN_KEY);

export const saveUserDetail = (user) => AsyncStorage.setItem(USER_DETAIL_KEY, JSON.stringify(user));
export const getUserDetail = () => AsyncStorage.getItem(USER_DETAIL_KEY);
export const removeUserDetail = () => AsyncStorage.removeItem(USER_DETAIL_KEY);

export const getOnboarding = () => AsyncStorage.getItem(ONBOARDING_COMPLETED);
export const saveOnboarding = () => AsyncStorage.setItem(ONBOARDING_COMPLETED, "Completed");
