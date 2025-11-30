import { poppins, inter } from "./themes/font";
import {
  getSessionStorageItem,
  keys,
  removeSessionStorageItem,
  setSessionStorageItem,
} from "./storage/sessionStorageUtils";
import { endpoints, API_BASE_URL } from "./api/apiConfig";
import { generateUrlSlug, parseSlug } from "./helper/helperFunctions";
import { UserInterface, AuthContextType } from "./commonInterfaces/interfaces";

export {
  getSessionStorageItem,
  keys,
  removeSessionStorageItem,
  setSessionStorageItem,
  poppins,
  inter,
  endpoints,
  API_BASE_URL, generateUrlSlug, parseSlug
};

export type {UserInterface, AuthContextType}