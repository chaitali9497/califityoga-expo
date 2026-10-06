import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "authToken";
const USER_DATA_KEY = "userData";
const FIRST_LOGIN_KEY = "firstLogin";
let cachedAuthToken: string | null = null;

export const saveAuthToken = async (token: string) => {
  try {
    cachedAuthToken = token;
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving auth token:", error);
  }
};

export const getAuthToken = async () => {
  try {
    if (cachedAuthToken) {
      return cachedAuthToken;
    }

    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    cachedAuthToken = token;
    return token;
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return null;
  }
};

export const setAuthToken = (token: string | null) => {
  cachedAuthToken = token;
};

export const removeAuthToken = async () => {
  try {
    cachedAuthToken = null;
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error("Error removing auth token:", error);
  }
};

export const saveUserData = async (userData: any) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return null;
  }
};

export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error("Error removing user data:", error);
  }
};

export const clearAllAuth = async () => {
  try {
    cachedAuthToken = null;
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};

export const setFirstLogin = async (value: boolean) => {
  try {
    await AsyncStorage.setItem(FIRST_LOGIN_KEY, value ? "true" : "false");
  } catch (error) {
    console.error("Error saving first login status:", error);
  }
};

export const getFirstLogin = async () => {
  try {
    const value = await AsyncStorage.getItem(FIRST_LOGIN_KEY);
    return value === "true";
  } catch (error) {
    console.error("Error retrieving first login status:", error);
    return false;
  }
};

export const clearFirstLogin = async () => {
  try {
    await AsyncStorage.removeItem(FIRST_LOGIN_KEY);
  } catch (error) {
    console.error("Error clearing first login status:", error);
  }
};
