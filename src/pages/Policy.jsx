import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Policy.css";

// TEMPLATE TEXT: general wording only. Replace each section with GramSupply's real policy
// (and have it checked by a legal adviser) before the shop goes live.
const pages = {
  "/shipping-returns": {
    title: "Shipping & Returns",
    intro: "How your order reaches you, and what to do if something is wrong.",
    sections: [
      ["Delivery", "Orders are delivered to the address given at checkout. Delivery time depends on the product, the quantity and your PIN code. Bulk and heavy items may be delivered separately."],
      ["Delivery charges", "Charges, and any free-delivery offers, are shown at checkout before you place the order."],
      ["Damaged or wrong items", "Please check your order on delivery. If an item is damaged, defective or not what you ordered, contact us with your order number and we will arrange a replacement or refund as per the terms confirmed at the time of order."],
      ["Returns", "Return eligibility depends on the product. Items that are used, installed or made to order may not be returnable. Contact us before sending anything back."],
      ["Cancelling an order", "You can cancel from My orders while the order is still being processed. Once it has been shipped, please contact us."],
    ],
  },
  "/terms": {
    title: "Terms & Conditions",
    intro: "The rules for using the GramSupply website and placing orders.",
    sections: [
      ["Using the site", "By using GramSupply you agree to give correct information and to use the site only for lawful purposes."],
      ["Products and prices", "Prices shown are indicative and may change. For bulk or institutional purchases, the final price is confirmed through a quotation."],
      ["Orders", "An order is accepted only after GramSupply confirms it. We may cancel an order if a product is unavailable or a price was shown by mistake."],
      ["Your account", "Keep your login details private. You are responsible for activity under your account."],
      ["Offers and coupons", "Offers and coupon codes have their own conditions, cannot be combined unless stated, and may end at any time."],
      ["Changes", "We may update these terms from time to time. The latest version is always on this page."],
    ],
  },
  "/privacy": {
    title: "Privacy Policy",
    intro: "What information GramSupply collects and how it is used.",
    sections: [
      ["What we collect", "Your name, phone number, email address and delivery address when you register, order or send an enquiry. We also keep your cart and wishlist so you can come back to them."],
      ["How we use it", "To process orders, answer enquiries, deliver products and improve the site. Products you save to your wishlist are stored against your account."],
      ["Sharing", "We share details only with the people needed to fulfil your order, such as delivery partners, or when the law requires it."],
      ["Your choices", "You can update your profile and address from My account, clear your wishlist from Settings, or contact us to ask for your data to be corrected or removed."],
      ["Security", "We take reasonable steps to protect your information, but no website can promise complete security."],
    ],
  },
};

function Policy() {
  const { pathname } = useLocation();
  const page = pages[pathname] || pages["/terms"];
  return (
    <>
      <Navbar />
      <main className="pol-page">
        <p className="pol-kicker">GRAMSUPPLY</p>
        <h1>{page.title}</h1>
        <p className="pol-intro">{page.intro}</p>
        <div className="pol-note">Template text. Replace it with your actual policy before launch.</div>
        {page.sections.map(([h, text]) => (
          <section key={h}><h2>{h}</h2><p>{text}</p></section>
        ))}
      </main>
      <Footer />
    </>
  );
}
export default Policy;
