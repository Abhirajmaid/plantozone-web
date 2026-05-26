import axios from "axios";
import { STRAPI_BASE_URL } from "../strapiBaseUrl";

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