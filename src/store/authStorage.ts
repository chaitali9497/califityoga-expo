import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "authToken";
const USER_DATA_KEY = "userData";

export const saveAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving auth token:", error);
  }
};

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return null;
  }
};

export const removeAuthToken = async () => {
  try {
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
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};
