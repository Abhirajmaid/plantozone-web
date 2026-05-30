import { createStrapiAxios } from "../strapiAxios";

const axiosClient = createStrapiAxios();


const registerUser = (data) => axiosClient.post('/auth/local/register', {
    username: data.username,
    email: data.email,
    password: data.password,
    mobile_number: data.mobile_number
})

const signIn = (data) => axiosClient.post('/auth/local', {
    identifier: data.email,
    password: data.password,
})

const postSubscriber = (data) => axiosClient.post('/mobile-numbers', {
    data: {
        mobile_number: data.mobile_number
    }
})

const fetchLoggedInUser = (token) => axiosClient.get('/users/me', {
    headers: {
        Authorization: `Bearer ${token}`,
    },
})

export default {
    registerUser,
    signIn,
    postSubscriber,
    fetchLoggedInUser
}