import axios from 'axios';

const baseUrl = 'https://dashboard.plantozone.com/api';

// Transform Strapi response to our cart item format
const transformCartItem = (item) => ({
    id: item.id,
    productId: item.attributes.product.data.id,
    title: item.attributes.product.data.attributes.title,
    price: item.attributes.price,
    size: item.attributes.size,
    quantity: item.attributes.quantity,
    image: item.attributes.product.data.attributes.images.data[0]?.attributes.url || ''
});

// Token retrieval function
const getToken = () => {
    return sessionStorage.getItem("jwt");
};

const axiosClient = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Fetch user's entire cart
const getUserCart = async () => {
    const token = getToken();

    try {
        const response = await axiosClient.get('/carts', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                'populate[0]': 'product',
                'populate[1]': 'product.images'
            }
        });

        return response.data.data.map(transformCartItem);
    } catch (error) {
        console.error('Error fetching cart', error);
        throw error;
    }
};

// Add item to cart
const addToCart = async (cartItem) => {
    const token = getToken();

    try {
        const response = await axiosClient.post('/carts', {
            data: {
                product: cartItem.product,
                price: cartItem.price,
                size: cartItem.size,
                quantity: cartItem.quantity,
                user: cartItem.userId
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return transformCartItem(response.data.data);
    } catch (error) {
        console.error('Error adding to cart', error);
        throw error;
    }
};

// Update cart item quantity
const updateCartItemQuantity = async (cartItemId, newQuantity) => {
    const token = getToken();

    try {
        await axiosClient.put(`/carts/${cartItemId}`, {
            data: { quantity: newQuantity }
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Error updating cart item', error);
        throw error;
    }
};

// Remove item from cart
const removeFromCart = async (cartItemId) => {
    const token = getToken();

    try {
        await axiosClient.delete(`/carts/${cartItemId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error('Error removing from cart', error);
        throw error;
    }
};

export default {
    getUserCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart
};