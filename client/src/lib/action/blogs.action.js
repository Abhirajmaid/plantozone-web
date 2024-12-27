const { default: axios } = require("axios");

const axiosClient = axios.create({
    baseURL: 'https://dashboard.plantozone.com/api',
    headers: {
        "Content-Type": 'application/json'
    }
})

const getBlogs = () => axiosClient.get('/blogs?populate=*')


export default {
    getBlogs,
}