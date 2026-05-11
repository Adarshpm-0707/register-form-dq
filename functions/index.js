const { onRequest } = require("firebase-functions/v2/https");
const Razorpay = require("razorpay");
const cors = require("cors")({ origin: true });
const crypto = require("crypto");

// Razorpay configuration
// Note: In production, use Firebase Secrets for these keys
const razorpay = new Razorpay({
  key_id: "rzp_live_SnxCrKgLPqpHnz",
  key_secret: "egWpGa3JqGRSF8E1hHGx2wwS", // User should update this if different
});

exports.api = onRequest((req, res) => {
  cors(req, res, async () => {
    const path = req.path;

    if (path === "/create-order" && req.method === "POST") {
      try {
        const { amount, currency = "INR", receipt = "receipt_1" } = req.body;

        if (!amount || amount < 100) {
          return res.status(400).json({ error: "Amount must be at least 100 paise (₹1)" });
        }

        const options = {
          amount: parseInt(amount),
          currency,
          receipt,
        };

        const order = await razorpay.orders.create(options);
        return res.json({
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
        });
      } catch (error) {
        console.error("Razorpay Order Error:", error);
        return res.status(500).json({ error: error.message });
      }
    }

    if (path === "/verify-payment" && req.method === "POST") {
      try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
          .createHmac("sha256", "egWpGa3JqGRSF8E1hHGx2wwS")
          .update(sign.toString())
          .digest("hex");

        if (razorpay_signature === expectedSign) {
          return res.json({ success: true, message: "Payment verified successfully" });
        } else {
          return res.status(400).json({ success: false, message: "Invalid signature" });
        }
      } catch (error) {
        console.error("Verification Error:", error);
        return res.status(500).json({ error: error.message });
      }
    }

    return res.status(404).send("Endpoint not found");
  });
});
