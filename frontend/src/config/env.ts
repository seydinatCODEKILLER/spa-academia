import { IEnvironnementConfig } from "@core/interface/IEnvironnementConfig.js";

export function getEnvironnementConfig(): IEnvironnementConfig {
  return {
    basePath: import.meta.env.VITE_BASE_PATH || "",
    loginPage: import.meta.env.VITE_LOGIN_PAGE || "/login",
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    mode: import.meta.env.MODE as "development" | "production",
  };
}
