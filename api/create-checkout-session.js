// api/create-checkout-session.js
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { items, shippingInfo, userId } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid items payload" });
  }

  try {
    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name || "Item" },
        unit_amount: Math.round(parseFloat(item.price) * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${req.headers.origin}/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,
      metadata: {
        userId,
        shippingInfo: JSON.stringify(shippingInfo),
      },
    });

    return res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe session error:", err);
    return res.status(500).json({ error: err.message });
  }
};