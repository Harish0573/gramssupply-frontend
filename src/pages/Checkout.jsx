import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  Banknote,
  Building2,
  CreditCard,
  Landmark,
  Smartphone,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../api/axiosConfig";
import api from "../api/axiosConfig";
import { fetchProducts, findCartProduct } from "../utils/catalog";
import "./Checkout.css";

const states = [
  "Andhra Pradesh",
  "Bihar",
  "Chhattisgarh",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
  "Other",
];

const banks = [
  "State Bank of India",
  "Bank of Maharashtra",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Punjab National Bank",
  "Other bank",
];

const paymentOptions = [
  {
    id: "upi",
    label: "UPI",
    hint: "Google Pay, PhonePe, Paytm",
    icon: Smartphone,
  },
  {
    id: "card",
    label: "Debit / Credit card",
    hint: "Visa, Mastercard, RuPay",
    icon: CreditCard,
  },
  {
    id: "netbanking",
    label: "Net banking",
    hint: "Pay from your bank account",
    icon: Landmark,
  },
  {
    id: "bank",
    label: "Bank transfer / PO",
    hint: "For schools and offices",
    icon: Building2,
  },
  {
    id: "cod",
    label: "Cash on delivery",
    hint: "Pay when the order arrives",
    icon: Banknote,
  },
];

const emptyForm = {
  name: "",
  organisation: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  notes: "",
};

const emptyPayment = {
  upiId: "",
  cardNumber: "",
  cardName: "",
  expiry: "",
  cvv: "",
  bank: "",
};

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [params] = useSearchParams();
  const buyNow = params.get("buy") === "1";

  const [step, setStep] = useState(1);
  // fill the form from the saved profile so the customer does not type it again
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...Object.fromEntries(
      Object.keys(emptyForm).map((k) => [k, user?.[k] || ""]),
    ),
  }));
  const [method, setMethod] = useState("upi");
  const [payment, setPayment] = useState(emptyPayment);
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");

  // which items are we buying? either the single "buy now" item or the whole cart
  const [items] = useState(() => {
    try {
      const key = buyNow ? "jr_buynow" : "jr_cart";
      const saved = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  // fill the form from the saved profile once it is available
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      ...Object.fromEntries(
        Object.keys(emptyForm).map((k) => [k, f[k] || user[k] || ""]),
      ),
    }));
  }, [user]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const lines = useMemo(() => {
    return items
      .map((item) => {
        const p = findCartProduct(item, products);
        if (!p) return null;
        return {
          id: p.id,
          name: p.name,
          image: p.imageUrl || p.image,
          price: Number(p.price) > 0 ? Number(p.price) : null,
          quantity: Number(item.quantity) || 1,
        };
      })
      .filter(Boolean);
  }, [items, products]);

  const allPriced = lines.length > 0 && lines.every((l) => l.price !== null);
  const total = lines.reduce((sum, l) => sum + (l.price || 0) * l.quantity, 0);
  const rupees = (n) => `₹${n.toLocaleString("en-IN")}`;

  const setField = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const setPay = (e) =>
    setPayment({ ...payment, [e.target.name]: e.target.value });

  function validateDelivery() {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name";
    if (!/^[6-9]\d{9}$/.test(form.phone))
      e.phone = "Enter a 10 digit mobile number";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "This email doesn't look right";
    if (form.address.trim().length < 5)
      e.address = "Enter the delivery address";
    if (!form.city.trim()) e.city = "Enter village or city";
    if (!form.district.trim()) e.district = "Enter your district";
    if (!form.state) e.state = "Select a state";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "PIN code must be 6 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validatePayment() {
    const e = {};
    if (method === "upi" && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(payment.upiId)) {
      e.upiId = "Enter a valid UPI ID, like name@upi";
    }
    if (method === "card") {
      if (payment.cardNumber.replace(/\s/g, "").length !== 16)
        e.cardNumber = "Card number must be 16 digits";
      if (!payment.cardName.trim()) e.cardName = "Enter the name on the card";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry))
        e.expiry = "Use MM/YY";
      if (!/^\d{3}$/.test(payment.cvv)) e.cvv = "3 digits";
    }
    if (method === "netbanking" && !payment.bank) e.bank = "Choose your bank";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const goToPayment = () =>
    validateDelivery() && (setStep(2), window.scrollTo(0, 0));
  const goToReview = () =>
    validatePayment() && (setStep(3), window.scrollTo(0, 0));

  async function placeOrder() {
    setPlacing(true);
    setOrderError("");
    const digits = payment.cardNumber.replace(/\s/g, "");

    // the server works out the prices itself, we only send what was picked
    const order = {
      ...form,
      paymentMethod: method,
      // never send the full card number or CVV, only the last 4 digits
      cardLast4: method === "card" ? digits.slice(-4) : null,
      items: lines.map((l) => ({ productId: l.id, quantity: l.quantity })),
    };

    try {
      const res = await api.post("/orders", order);
      localStorage.removeItem(buyNow ? "jr_buynow" : "jr_cart");
      window.dispatchEvent(new Event("cart-updated"));
      navigate(`/order-success/${res.data.orderId}`, {
        state: { order: res.data },
      });
    } catch (err) {
      setOrderError(errorMessage(err, "We could not place your order."));
      setPlacing(false);
    }
  }

  if (authLoading) return null;

  // customers have to sign in before they can buy
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="checkout-page">
          <div className="checkout-empty">
            <h2>Nothing to check out</h2>
            <p>Your cart is empty. Add a product first.</p>
            <Link to="/products" className="checkout-btn">
              Browse products
            </Link>
          </div>
        </main>
      </>
    );
  }

  const field = (name, label, props = {}) => (
    <label
      className={`field ${errors[name] ? "has-error" : ""} ${props.wide ? "wide" : ""}`}
    >
      <span>{label}</span>
      <input name={name} value={form[name]} onChange={setField} {...props} />
      {errors[name] && <em>{errors[name]}</em>}
    </label>
  );

  const payField = (name, label, props = {}) => (
    <label className={`field ${errors[name] ? "has-error" : ""}`}>
      <span>{label}</span>
      <input name={name} value={payment[name]} onChange={setPay} {...props} />
      {errors[name] && <em>{errors[name]}</em>}
    </label>
  );

  return (
    <>
      <Navbar />
      <main className="checkout-page">
        <ol className="checkout-steps">
          {["Delivery details", "Payment method", "Review order"].map(
            (label, i) => (
              <li
                key={label}
                className={
                  step === i + 1 ? "current" : step > i + 1 ? "done" : ""
                }
              >
                <b>{i + 1}</b> {label}
              </li>
            ),
          )}
        </ol>

        <div className="checkout-layout">
          <section className="checkout-card">
            {step === 1 && (
              <>
                <h2>Where should we deliver?</h2>
                <div className="field-grid">
                  {field("name", "Full name", { autoComplete: "name" })}
                  {field(
                    "organisation",
                    "School / office / Gram Panchayat (optional)",
                  )}
                  {field("phone", "Mobile number", {
                    inputMode: "numeric",
                    maxLength: 10,
                    autoComplete: "tel",
                  })}
                  {field("email", "Email (optional)", {
                    type: "email",
                    autoComplete: "email",
                  })}
                  {field("address", "Address", {
                    wide: true,
                    autoComplete: "street-address",
                  })}
                  {field("city", "Village / city")}
                  {field("district", "District")}
                  <label className={`field ${errors.state ? "has-error" : ""}`}>
                    <span>State</span>
                    <select name="state" value={form.state} onChange={setField}>
                      <option value="">Select state</option>
                      {states.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    {errors.state && <em>{errors.state}</em>}
                  </label>
                  {field("pincode", "PIN code", {
                    inputMode: "numeric",
                    maxLength: 6,
                  })}
                  {field("notes", "Delivery notes (optional)", { wide: true })}
                </div>
                <button className="checkout-btn" onClick={goToPayment}>
                  Continue to payment
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2>How would you like to pay?</h2>
                <div className="pay-options">
                  {paymentOptions.map(({ id, label, hint, icon: Icon }) => (
                    <label
                      key={id}
                      className={`pay-option ${method === id ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="method"
                        checked={method === id}
                        onChange={() => {
                          setMethod(id);
                          setErrors({});
                        }}
                      />
                      <Icon size={22} />
                      <span>
                        <strong>{label}</strong>
                        <small>{hint}</small>
                      </span>
                    </label>
                  ))}
                </div>

                <div className="pay-details">
                  {method === "upi" &&
                    payField("upiId", "UPI ID", { placeholder: "name@upi" })}
                  {method === "card" && (
                    <div className="field-grid">
                      {payField("cardNumber", "Card number", {
                        inputMode: "numeric",
                        maxLength: 19,
                        placeholder: "1234 5678 9012 3456",
                      })}
                      {payField("cardName", "Name on card")}
                      {payField("expiry", "Expiry", {
                        placeholder: "MM/YY",
                        maxLength: 5,
                      })}
                      {payField("cvv", "CVV", {
                        type: "password",
                        inputMode: "numeric",
                        maxLength: 3,
                      })}
                    </div>
                  )}
                  {method === "netbanking" && (
                    <label
                      className={`field ${errors.bank ? "has-error" : ""}`}
                    >
                      <span>Select your bank</span>
                      <select
                        name="bank"
                        value={payment.bank}
                        onChange={setPay}
                      >
                        <option value="">Choose bank</option>
                        {banks.map((b) => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                      {errors.bank && <em>{errors.bank}</em>}
                    </label>
                  )}
                  {method === "bank" && (
                    <p className="pay-note">
                      We will send our bank details and a proforma invoice after
                      you place the order. Your order is processed once the
                      payment or purchase order is received.
                    </p>
                  )}
                  {method === "cod" && (
                    <p className="pay-note">
                      Pay in cash to the delivery person when the order arrives.
                    </p>
                  )}
                </div>

                <div className="checkout-actions">
                  <button
                    className="checkout-back"
                    onClick={() => {
                      setStep(1);
                      setErrors({});
                    }}
                  >
                    Back
                  </button>
                  <button className="checkout-btn" onClick={goToReview}>
                    Review order
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2>Check your order</h2>
                <div className="review-block">
                  <h3>
                    Delivering to{" "}
                    <button onClick={() => setStep(1)}>Change</button>
                  </h3>
                  <p>
                    {form.name}
                    {form.organisation && `, ${form.organisation}`}
                    <br />
                    {form.address}, {form.city}, {form.district}
                    <br />
                    {form.state} - {form.pincode}
                    <br />
                    Mobile: {form.phone}
                  </p>
                </div>
                <div className="review-block">
                  <h3>
                    Payment <button onClick={() => setStep(2)}>Change</button>
                  </h3>
                  <p>
                    {paymentOptions.find((p) => p.id === method).label}
                    {method === "upi" && ` (${payment.upiId})`}
                    {method === "card" &&
                      ` ending ${payment.cardNumber.replace(/\s/g, "").slice(-4)}`}
                    {method === "netbanking" && ` (${payment.bank})`}
                  </p>
                </div>
                {orderError && (
                  <p className="auth-error" role="alert">
                    {orderError}
                  </p>
                )}
                <div className="checkout-actions">
                  <button className="checkout-back" onClick={() => setStep(2)}>
                    Back
                  </button>
                  <button
                    className="checkout-btn"
                    onClick={placeOrder}
                    disabled={placing}
                  >
                    {placing ? "Placing order..." : "Place order"}
                  </button>
                </div>
              </>
            )}
          </section>

          <aside className="checkout-summary">
            <h3>Order summary</h3>
            {lines.map((l) => (
              <div className="sum-line" key={l.id}>
                <img
                  src={l.image}
                  alt=""
                  onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                />
                <span>
                  {l.name}
                  <small>Qty {l.quantity}</small>
                </span>
                <b>{l.price ? rupees(l.price * l.quantity) : "On request"}</b>
              </div>
            ))}
            <div className="sum-total">
              <span>Total</span>
              <strong>
                {allPriced ? rupees(total) : "Confirmed after order"}
              </strong>
            </div>
            {!allPriced && (
              <p className="sum-note">
                Some items don't have a listed price. Our team will confirm the
                final amount before delivery.
              </p>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}

export default Checkout;
