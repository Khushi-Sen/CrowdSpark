import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function PaymentPage() {
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get("campaignId");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [amount, setAmount] = useState("");

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!name || !email || !contact || !amount) {
      alert("Please fill all fields including amount");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    try {
      const orderData = await axios.post("https://crowd-spark-backend.onrender.com/api/payment/create-order", {
        amount: parseInt(amount)
      });

      const options = {
        key: "rzp_test_aPDakOSgv4Z2HQ",
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: "CrowdSpark",
        description: campaignId
          ? `Support Campaign #${campaignId}`
          : "Support a Campaign",
        handler: async function (response) {
          alert("Payment Successful ✅");

          console.log("Payment response:", response);

          if (campaignId) {
            try {
              await axios.put(`https://crowd-spark-backend.onrender.com/api/campaigns/${campaignId}/fund`, {
                amount: parseInt(amount)
              });
            } catch (err) {
              console.error("Failed to update campaign funds:", err);
              alert("Payment done, but failed to update campaign funds.");
            }
          }
        },
        prefill: {
          name,
          email,
          contact,
        },
        theme: {
          color: "#6366F1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error("Error creating order:", err);
      alert("Failed to initiate payment.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Support {campaignId ? `Campaign #${campaignId}` : "a Campaign"}
      </h2>

      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <input
        type="tel"
        placeholder="Contact Number"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <input
        type="number"
        placeholder="Enter Amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        min="1"
      />

      <button
        onClick={handlePayment}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Pay ₹{amount || "_"}
      </button>
    </div>
  );
}

export default PaymentPage;
