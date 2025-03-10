const { default: axios } = require("axios");

const axiosClient = axios.create({
    baseURL: 'https://dashboard.plantozone.com/api',
    headers: {
        "Content-Type": 'application/json'
    }
})

const getPlants = () => axiosClient.get('/plants?populate=*')

const getPlantById = (id) => axiosClient.get(`/plants/${id}?populate=*`)


export default {
    getPlants,
    getPlantById
}