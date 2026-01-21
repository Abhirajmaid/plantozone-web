const { default: axios } = require("axios");

const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';
const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://dashboard.plantozone.com';

const axiosClient = axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: {
        "Content-Type": 'application/json',
        ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` })
    }
})

const getPlants = () => axiosClient.get('/plants?populate=*&pagination[pageSize]=100')

const getPlantById = (id) => axiosClient.get(`/plants/${id}?populate=*`)


export default {
    getPlants,
    getPlantById
}