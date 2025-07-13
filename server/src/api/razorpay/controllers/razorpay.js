'use strict';
const Razorpay = require("razorpay");

module.exports = {
  async createOrder(ctx) {
    const { amount } = ctx.request.body;
    const razorpay = new Razorpay({
      key_id: "rzp_live_sJplWbjaaPEBXZ",
      key_secret: "3GPhLJRBwl8slBvpbyMjIIen",
    });
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
      payment_capture: 1,
    };
    try {
      const order = await razorpay.orders.create(options);
      ctx.send(order);
    } catch (err) {
      ctx.status = 500;
      ctx.send({ error: err.message });
    }
  },

  verifyPayment(ctx) {
    const crypto = require("crypto");
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = ctx.request.body;
    const key_secret = "3GPhLJRBwl8slBvpbyMjIIen";
    const generated_signature = crypto
      .createHmac("sha256", key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      ctx.send({ success: true });
    } else {
      ctx.status = 400;
      ctx.send({ success: false, error: "Invalid signature" });
    }
  }
};
