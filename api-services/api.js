import axios from "axios";
import {
  API_URL,
  API_AZURE_URL,
  VENUE_GUID,
  APP_NAME,
  APP_VERSION,
  APP_GUID,
  APP_WORKSPACE_GUID,
  BIZFIRE_API,
  FRANCHISE_GUID,
  SUB_VENUE_GUID,
} from "../constant.js";

export const headerInfo = (
  workspace_guid = APP_WORKSPACE_GUID,
  user_guid = "00000000-0000-4000-8000-000000000002"
) => {
  return {
    workspace_guid: workspace_guid || "11111111-1111-4000-8000-000000000001",
    user_guid: user_guid || "00000000-0000-4000-8000-000000000002",
    app_type: "admin",
    app_context_json: {
      franchise_id: FRANCHISE_GUID || "331D7FCB-38CE-40D2-A114-503A52B601D5",
      venue_id: VENUE_GUID || "5B7B508C-F6CC-456E-A51E-8694EDE88460",
      subvenue_id: SUB_VENUE_GUID || "484C5D90-3B31-4D4A-BE96-0038A35E2052",
      app_name: APP_NAME || "Bizfire Content Editor",
      app_version: APP_VERSION || "1.0",
      app_guid: APP_GUID || "220F9A16-21D6-476C-A716-0528577427ED",
    },
  };
};

const azureAxiosInstance = axios.create({
  baseURL: API_AZURE_URL || API_URL,
  headers: {
    "Content-Type": "application/json",
    "Header-Json": JSON.stringify(headerInfo()),
  },
});

const bizFireAxiosInstance = axios.create({
  baseURL: BIZFIRE_API,
  headers: {
    "Content-Type": "application/json",
    "Header-Json": JSON.stringify(headerInfo()),
  },
});

const multipartInstance = axios.create({
  baseURL: API_AZURE_URL || API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

export {
  azureAxiosInstance,
  bizFireAxiosInstance,
  multipartInstance,
  axiosInstance,
};
