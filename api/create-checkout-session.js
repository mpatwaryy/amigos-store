// api/create-checkout-session.js

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  //  Allow requests from any origin (fixes local dev issue)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  //  Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { items, shippingInfo, userId, orderId } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid items payload" });
  }

  try {
    const line_items = items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(parseFloat(item.price) * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${req.headers.origin}/success?orderId=${orderId}`,
      cancel_url: `${req.headers.origin}/checkout`,
      metadata: {
        userId,
        shippingInfo: JSON.stringify(shippingInfo),
      },
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: err.message });
  }
};