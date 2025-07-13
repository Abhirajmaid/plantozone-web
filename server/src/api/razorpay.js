const Razorpay = require("razorpay");
const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: "rzp_live_sJplWbjaaPEBXZ",
  key_secret: "3GPhLJRBwl8slBvpbyMjIIen",
});

router.post("/create-razorpay-order", async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100, // amount in paise
    currency: "INR",
    receipt: "order_rcptid_" + Date.now(),
    payment_capture: 1,
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/verify-razorpay-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const key_secret = "3GPhLJRBwl8slBvpbyMjIIen";
  const generated_signature = crypto
    .createHmac("sha256", key_secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, error: "Invalid signature" });
  }
});

module.exports = router;
