module.exports = {
    routes: [
        {
            method: "POST",
            path: "/create-razorpay-order",
            handler: "razorpay.createOrder",
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "POST",
            path: "/verify-razorpay-payment",
            handler: "razorpay.verifyPayment",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
