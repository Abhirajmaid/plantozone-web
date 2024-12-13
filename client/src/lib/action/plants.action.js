const { default: axios } = require("axios");

const axiosClient = axios.create({
    baseURL: 'http://localhost:1337/api',
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