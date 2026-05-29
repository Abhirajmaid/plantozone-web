import axios from "axios";
import { STRAPI_BASE_URL } from "../strapiBaseUrl";

const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "";

const getClient = () =>
  axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: {
      "Content-Type": "application/json",
      ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
    },
  });

/** Fetch orders for the logged-in user by email */
const getOrdersByEmail = (email, params = {}) => {
  if (!email) {
    return Promise.reject(new Error("Email is required"));
  }

  const queryParams = new URLSearchParams({
    "filters[userEmail][$eq]": email.trim(),
    sort: params.sort || "createdAt:desc",
    "pagination[pageSize]": String(params.pageSize || 50),
    "pagination[page]": String(params.page || 1),
    publicationState: "preview",
  });

  return getClient().get(`/order-details?${queryParams}`);
};

const getOrderById = (id) => {
  return getClient().get(
    `/order-details/${id}?publicationState=preview`
  );
};

export default {
  getOrdersByEmail,
  getOrderById,
};
