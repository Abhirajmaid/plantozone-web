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

const getCategories = () => axiosClient.get('/categories?populate=*&pagination[pageSize]=100')

const getCategoryById = (id) => axiosClient.get(`/categories/${id}?populate=*`)

export default {
    getCategories,
    getCategoryById
}
