import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Globe, Heart, LogOut, Package, Receipt, Settings, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getWishlist, syncWishlist } from "../utils/wishlist";
import { useAuth } from "../context/AuthContext";
import api, { errorMessage } from "../api/axiosConfig";
import { openReceipt } from "../utils/receipt";
import "./Account.css";

const methodNames = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net banking",
  bank: "Bank transfer / PO",
  cod: "Cash on delivery",
};

const statusLabels = {
  PLACED: "Order placed",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const profileFields = [
  ["name", "Full name"],
  ["organisation", "School / office / Gram Panchayat"],
  ["phone", "Mobile number"],
  ["email", "Email"],
  ["address", "Address"],
  ["city", "Village / city"],
  ["district", "District"],
  ["state", "State"],
  ["pincode", "PIN code"],
];

function Account() {
  const { user, loading, logout, updateProfile } = useAuth();
  const { t: tr, i18n } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState("orders");
  const [openId, setOpenId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [profile, setProfile] = useState(user || {});
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState("");
  const myEnq = (() => { try { return JSON.parse(localStorage.getItem("jr_my_enquiries") || "[]"); } catch { return []; } })();
  const wishCount = getWishlist().length;

  useEffect(() => { if (user) syncWishlist(user); }, [user]);

  // load this customer's orders from the backend
  useEffect(() => {
    if (!user) return;
    api
      .get("/orders/my")
      .then((res) => setOrders(res.data))
      .catch((err) =>
        setOrdersError(errorMessage(err, "Could not load your orders.")),
      )
      .finally(() => setOrdersLoading(false));
  }, [user]);

  // the profile form should show the saved details once they are loaded
  useEffect(() => {
    if (user) setProfile(user);
  }, [user]);

  if (loading) return null;
  if (!user)
    return <Navigate to="/login" state={{ from: "/account" }} replace />;

  async function cancelOrder(orderId) {
    if (!window.confirm("Cancel this order?")) return;
    try {
      const res = await api.post(`/orders/${orderId}/cancel`);
      setOrders(orders.map((o) => (o.orderId === orderId ? res.data : o)));
    } catch (err) {
      alert(errorMessage(err));
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    if (profile.name.trim().length < 2)
      return setProfileError("Name is required");
    if (!/^[6-9]\d{9}$/.test(profile.phone))
      return setProfileError("Enter a 10 digit mobile number");
    if (profile.pincode && !/^\d{6}$/.test(profile.pincode))
      return setProfileError("PIN code must be 6 digits");
    setProfileError("");
    try {
      await updateProfile(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setProfileError(errorMessage(err));
    }
  }

  return (
    <>
      <header className="acc-top">
        <Link to="/" className="acc-brand"><span>G</span>GramSupply<b>.</b></Link>
        <Link to="/" className="acc-back"><ArrowLeft size={18} /> Back to shop</Link>
      </header>
      <main className="account-page acc2">
        <section className="acc-hero">
          <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
          <div className="acc-who">
            <small>Welcome back</small>
            <h1>{user.name}</h1>
            <p>{user.email || user.phone} · Customer ID {user.customerId}</p>
          </div>
          <div className="acc-stats">
            <div><b>{orders.length}</b>Orders</div>
            <div><b>{wishCount}</b>Wishlist</div>
            <div><b>{myEnq.length}</b>Enquiries</div>
          </div>
          <div className="acc-quick">
            <Link to="/wishlist" className="acc-pill"><Heart size={19} /> {tr("Wishlist")} <b>{wishCount}</b></Link>
            <Link to="/settings" className="acc-pill"><Settings size={19} /> {tr("Settings")}</Link>
            <div className="acc-lang" role="group" aria-label={tr("Language")}>
              <Globe size={19} />
              {[["en", "English"], ["mr", "मराठी"]].map(([k, n]) => (
                <button key={k} type="button" className={i18n.language === k ? "on" : ""} onClick={() => i18n.changeLanguage(k)}>{n}</button>
              ))}
            </div>
          </div>
        </section>

        <nav className="acc-tiles" aria-label="Account options">
          {[
            [Package, "My orders", "Track, cancel and download receipts", () => setTab("orders"), "orders"],
            [Heart, "Wishlist", "Products you have saved", "/wishlist"],
            [FileText, "My enquiries", "Quotes you have requested", () => setTab("enquiries"), "enquiries"],
            [UserRound, "Profile & address", "Your details and delivery address", () => setTab("profile"), "profile"],
            [Settings, "Settings", "Language, text size, notifications", "/settings"],
            [LogOut, "Sign out", "Log out of this device", () => { logout(); navigate("/"); }],
          ].map(([Icon, title, hint, go, key]) => {
            const body = (<><Icon size={26} /><span><b>{title}</b><small>{hint}</small></span></>);
            return typeof go === "string" ? (
              <Link key={title} to={go} className="acc-tile">{body}</Link>
            ) : (
              <button key={title} type="button" className={`acc-tile ${key && tab === key ? "on" : ""}`} onClick={go}>{body}</button>
            );
          })}
        </nav>

        <section className="account-main">
          {tab === "orders" && (
            <>
              <h1>My orders</h1>
              {ordersLoading ? (
                <div className="account-empty">
                  <p>Loading your orders...</p>
                </div>
              ) : ordersError ? (
                <div className="account-empty">
                  <p className="auth-error">{ordersError}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="account-empty">
                  <p>You haven't placed any orders yet.</p>
                  <Link to="/products" className="auth-submit">
                    Start shopping
                  </Link>
                </div>
              ) : (
                orders.map((o) => (
                  <article className="order-card" key={o.orderId}>
                    <header>
                      <div>
                        <small>Order number</small>
                        <strong>{o.orderId}</strong>
                      </div>
                      <div>
                        <small>Placed on</small>
                        <strong>
                          {new Date(o.placedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </strong>
                      </div>
                      <div>
                        <small>Total</small>
                        <strong>
                          {o.total
                            ? `₹${o.total.toLocaleString("en-IN")}`
                            : "To be confirmed"}
                        </strong>
                      </div>
                      <span
                        className={`status ${(o.status || "PLACED").toLowerCase()}`}
                      >
                        {statusLabels[o.status] || o.status}
                      </span>
                    </header>

                    <ul>
                      {o.items.map((item) => (
                        <li key={item.productId}>
                          {item.name} <span>× {item.quantity}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="order-actions">
                      <button
                        onClick={() =>
                          setOpenId(openId === o.orderId ? null : o.orderId)
                        }
                      >
                        {openId === o.orderId ? "Hide details" : "View details"}
                      </button>
                      <button onClick={() => openReceipt(o)}>
                        <Receipt size={16} /> Receipt
                      </button>
                      {o.status === "PLACED" && (
                        <button
                          className="danger"
                          onClick={() => cancelOrder(o.orderId)}
                        >
                          Cancel order
                        </button>
                      )}
                    </div>

                    {openId === o.orderId && (
                      <div className="order-details">
                        <p>
                          <b>Delivering to</b>
                          <br />
                          {o.customer.name}, {o.customer.address},{" "}
                          {o.customer.city}, {o.customer.district},{" "}
                          {o.customer.state} - {o.customer.pincode}
                          <br />
                          Mobile: {o.customer.phone}
                        </p>
                        <p>
                          <b>Payment</b>
                          <br />
                          {methodNames[o.paymentMethod]}
                          {o.cardLast4 && ` ending ${o.cardLast4}`}
                        </p>
                      </div>
                    )}
                  </article>
                ))
              )}
            </>
          )}

          {tab === "enquiries" && (
            <>
              <h1>My enquiries</h1>
              {myEnq.length === 0 ? (
                <div className="account-empty">
                  <p>You haven't sent any enquiries from this device yet.</p>
                  <Link to="/enquiry" className="auth-submit">Request a quote</Link>
                </div>
              ) : (
                myEnq.map((q, i) => (
                  <article className="order-card" key={q.id || i}>
                    <header>
                      <div><small>Enquiry</small><strong>{q.id ? `#${q.id}` : "Sent"}</strong></div>
                      <div><small>Sent on</small><strong>{new Date(q.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong></div>
                      <span className={`status ${(q.status || "NEW").toLowerCase()}`}>{q.status || "NEW"}</span>
                    </header>
                    {q.message && <p className="enq-msg">{q.message}</p>}
                  </article>
                ))
              )}
            </>
          )}

          {tab === "profile" && (
            <>
              <h1>My profile</h1>
              <form className="profile-form" onSubmit={saveProfile}>
                <p className="profile-meta">
                  Customer ID <b>{user.customerId}</b> · Member since{" "}
                  {new Date(user.createdAt).getFullYear()}
                </p>
                <div className="profile-grid">
                  {profileFields.map(([name, label]) => (
                    <label
                      key={name}
                      // className={name === "address" ? "wide" : ""}
                      className="wide">
                    
                      {label}
                      <input
                        value={profile[name] || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, [name]: e.target.value })
                        }
                      />
                    </label>
                  ))}
                </div>
                {profileError && (
                  <p className="auth-error" role="alert">
                    {profileError}
                  </p>
                )}
                <button className="auth-submit">Save changes</button>
                {saved && <span className="saved-msg">Saved</span>}
              </form>
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default Account;
