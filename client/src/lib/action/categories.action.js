import { createStrapiAxios } from "../strapiAxios";

const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';

const axiosClient = createStrapiAxios({
    headers: {
        "Content-Type": 'application/json',
        ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` })
    }
})

const getCategories = () =>
  axiosClient.get(
    "/categories?populate=*&publicationState=preview&pagination[pageSize]=100"
  );

const getCategoryById = (id) => axiosClient.get(`/categories/${id}?populate=*`)

export default {
    getCategories,
    getCategoryById
}
