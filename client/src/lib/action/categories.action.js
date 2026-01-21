const { default: axios } = require("axios");

const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';

const axiosClient = axios.create({
    baseURL: 'http://localhost:1337/api',
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
