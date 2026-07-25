export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://ecommerce-back-end-production-af56.up.railway.app"
).replace(/\/+$/, "");

export const APP_NAME = "Xeno Store";
export const DEFAULT_PAGE_LIMIT = 12;

export const TOKEN_KEY = "ecom_access_token";
export const REFRESH_TOKEN_KEY = "ecom_refresh_token";
export const USER_KEY = "ecom_user_data";
export const THEME_KEY = "ecom_theme";
