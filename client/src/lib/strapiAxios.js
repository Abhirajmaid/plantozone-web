import axios from "axios";
import { getStrapiBaseUrl } from "./strapiBaseUrl";

/** Strapi REST API base, e.g. `/strapi-api/api` in local dev or `https://…/api` in production */
export function strapiApiBase() {
  return `${getStrapiBaseUrl()}/api`;
}

export function createStrapiAxios(config = {}) {
  const extra =
    config.headers && typeof config.headers === "object"
      ? config.headers
      : config;

  return axios.create({
    baseURL: strapiApiBase(),
    headers: {
      "Content-Type": "application/json",
      ...extra,
    },
  });
}
