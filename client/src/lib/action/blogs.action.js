const { default: axios } = require("axios");

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://dashboard.plantozone.com';

const axiosClient = axios.create({
    baseURL: `${STRAPI_BASE_URL}/api`,
    headers: {
        "Content-Type": 'application/json'
    }
})

const getBlogs = () => axiosClient.get('/blogs?populate=*')


export default {
    getBlogs,
}