const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors()); // Simplified CORS for local dev
app.use(express.json());

// Health check route to verify server is up
app.get('/', (req, res) => {
  res.send('Razorpay Backend is active');
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'MISSING_KEY',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'MISSING_SECRET',
});

// Validate keys on startup
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('⚠️ WARNING: Razorpay API keys are missing in .env file!');
}

// Create Order Endpoint
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'receipt_1' } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Amount must be at least 100 paise (₹1)' });
    }

    const options = {
      amount: parseInt(amount),
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify Payment Endpoint
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 8888; 

app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err);
  } else {
    console.log('--------------------------------------------------');
    console.log(`🚀 RAZORPAY SERVER IS ACTIVE`);
    console.log(`📡 URL: http://127.0.0.1:${PORT}`);
    console.log('--------------------------------------------------');
  }
});
