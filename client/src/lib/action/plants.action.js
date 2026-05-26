import axios from "axios";
import { STRAPI_BASE_URL } from "../strapiBaseUrl";

const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';

const axiosClient = axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: {
        "Content-Type": 'application/json',
        ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` })
    }
})

const getPlants = (params = {}) => {
  const sp = new URLSearchParams({ populate: "*", "pagination[pageSize]": 100 });
  if (params.search != null && String(params.search).trim()) {
    sp.set("filters[title][$containsi]", String(params.search).trim());
  }
  return axiosClient.get(`/plants?${sp}`);
};

const getPlantById = (id) => axiosClient.get(`/plants/${id}?populate=*`)


export default {
    getPlants,
    getPlantById
}