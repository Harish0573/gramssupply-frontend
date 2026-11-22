import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2, Receipt } from "lucide-react";
import Navbar from "../components/Navbar";
import { openReceipt } from "../utils/receipt";
import "./Checkout.css";

function OrderSuccess() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const order = state?.order;

  return (
    <>
      <Navbar />
      <main className="checkout-page">
        <div className="checkout-empty success">
          <CheckCircle2 size={56} />
          <h2>Thank you, your order is placed</h2>
          <p>
            Order number: <strong>{orderId}</strong>
          </p>
          {order && (
            <p>
              We will call you on {order.customer.phone} to confirm the delivery
              {order.total
                ? ` and the total of ₹${order.total.toLocaleString("en-IN")}`
                : " and the final price"}
              .
            </p>
          )}
          {order && (
            <button
              type="button"
              className="checkout-btn receipt-btn"
              onClick={() => openReceipt(order)}
            >
              <Receipt size={18} /> View / print receipt
            </button>
          )}
          <Link to="/account" className="checkout-btn">
            View my orders
          </Link>
        </div>
      </main>
    </>
  );
}

export default OrderSuccess;
