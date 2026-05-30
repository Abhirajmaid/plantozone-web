import { createStrapiAxios } from "../strapiAxios";

const axiosClient = createStrapiAxios();

const getBlogs = () => axiosClient.get('/blogs?populate=*')


export default {
    getBlogs,
}