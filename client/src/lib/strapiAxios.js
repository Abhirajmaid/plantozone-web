import axios from "axios";
import { getStrapiBaseUrl } from "./strapiBaseUrl";

/** Strapi REST API base, e.g. `/strapi-api/api` in local dev or `https://…/api` in production */
export function strapiApiBase() {
  return `${getStrapiBaseUrl()}/api`;
}

export function createStrapiAxios(headers = {}) {
  return axios.create({
    baseURL: strapiApiBase(),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}
