export const getToken = () => localStorage.getItem("authToken");

export const setToken = (token: string) => localStorage.setItem("authToken", token);

export const clearToken = () => localStorage.removeItem("authToken");