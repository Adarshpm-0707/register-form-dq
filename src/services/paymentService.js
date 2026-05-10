const API_URL = `http://${window.location.hostname}:5000/api`;

/**
 * Initiates Razorpay payment
 * @param {number} amount - Amount in INR
 * @param {object} userData - User details for prefill
 * @returns {Promise} - Resolves on successful payment verification
 */
export const initiatePayment = async (amount, userData) => {
  try {
    // 1. Create Order on Backend
    const response = await fetch(`${API_URL}/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      })
    });

    const orderData = await response.json();
    if (!response.ok) throw new Error(orderData.error || 'Failed to create order');

    // 2. Open Razorpay Checkout Modal
    return new Promise((resolve, reject) => {
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "DEEPSTAQ",
        description: "Registration Payment",
        order_id: orderData.order_id,
        handler: async function (response) {
          // 3. Verify Signature on Backend
          try {
            const verifyRes = await fetch(`${API_URL}/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              resolve(verifyData);
            } else {
              reject(new Error(verifyData.message || "Payment verification failed"));
            }
          } catch (err) {
            reject(new Error("Network error during verification"));
          }
        },
        prefill: {
          name: userData?.fullName || "",
          email: userData?.email || "",
          contact: userData?.phone || ""
        },
        theme: {
          color: "#c6ff34" // DeepStaq Lime
        },
        modal: {
          ondismiss: function() {
            reject(new Error("Payment cancelled by user"));
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        reject(new Error(response.error.description));
      });
      rzp.open();
    });
  } catch (error) {
    console.error("Payment Initiation Error:", error);
    throw error;
  }
};
