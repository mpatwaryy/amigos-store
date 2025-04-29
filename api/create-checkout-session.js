// /api/create-checkout-session.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }
  const { items, shippingInfo, userId } = req.body;

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
      success_url: `${req.headers.origin}/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,
      metadata: {
        userId,
        shippingInfo: JSON.stringify(shippingInfo),
      },
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
