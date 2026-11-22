import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ClipboardList, Heart, Lock, Package, RefreshCw, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api, { errorMessage } from "../api/axiosConfig";
import { getWishlist } from "../utils/wishlist";
import AdminProducts from "../components/AdminProducts";
import "./Admin.css";

const rows = (d) => (Array.isArray(d) ? d : Array.isArray(d?.content) ? d.content : []);
const inr = (n) => (n ? `₹${Number(n).toLocaleString("en-IN")}` : "—");
const when = (v) => (v ? new Date(v).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—");
const tryGet = async (paths) => {
  let last;
  for (const p of paths) {
    try { return (await api.get(p)).data; } catch (e) { last = e; }
  }
  throw last;
};
const ORDER_STATUS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const ENQ_STATUS = [["NEW", "New"], ["REVIEWED", "Reviewed"], ["APPROVED", "Approved"], ["REJECTED", "Rejected"]];

function AdminDashboard() {
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [wishRows, setWishRows] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [errors, setErrors] = useState({});
  const [wishSource, setWishSource] = useState("server");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const err = {};
    await Promise.all([
      tryGet(["/orders", "/admin/orders", "/orders/all"]).then((d) => setOrders(rows(d))).catch((e) => { setOrders([]); err.orders = e.response?.status === 403 ? "Only an admin account can view all orders." : e.response ? "The backend has no endpoint that lists all orders yet (GET /api/orders). See BACKEND-NOTES.md." : errorMessage(e); }),
      tryGet(["/enquiries"]).then((d) => setEnquiries(rows(d))).catch((e) => { setEnquiries([]); err.enquiries = errorMessage(e, "Could not load enquiries."); }),
      tryGet(["/wishlist/all", "/wishlist"]).then((d) => { setWishRows(rows(d)); setWishSource("server"); }).catch(() => { setWishRows(getWishlist().map((w) => ({ productId: w.id, productName: w.name, price: w.price, savedAt: w.savedAt }))); setWishSource("device"); }),
      api.get("/products").then((r) => setProductCount(rows(r.data).length)).catch(() => {}),
    ]);
    setErrors(err);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const wishlist = useMemo(() => {
    const m = new Map();
    wishRows.forEach((w) => {
      const k = w.productId ?? w.id ?? w.productName;
      const cur = m.get(k) || { id: k, name: w.productName || w.name, price: w.price, count: 0, who: new Set(), last: w.savedAt || w.createdAt };
      cur.count += 1;
      if (w.customerName || w.phone) cur.who.add([w.customerName, w.phone].filter(Boolean).join(" · "));
      m.set(k, cur);
    });
    return [...m.values()].sort((a, b) => b.count - a.count);
  }, [wishRows]);

  const setOrderStatus = async (o, status) => {
    try { await api.patch(`/orders/${o.orderId || o.id}/status`, { status }); setOrders(orders.map((x) => (x === o ? { ...x, status } : x))); }
    catch (e) { alert(errorMessage(e, "Could not update this order. The backend needs PATCH /api/orders/{id}/status.")); }
  };
  const setEnqStatus = async (e, status) => {
    try { await api.patch(`/enquiries/${e.id}/status`, { status }); setEnquiries(enquiries.map((x) => (x.id === e.id ? { ...x, status } : x))); }
    catch (er) { alert(errorMessage(er)); }
  };

  const stats = [[ShoppingBag, "Orders", orders.length], [ClipboardList, "Enquiries", enquiries.length], [Heart, "Wishlist saves", wishRows.length], [Package, "Products", productCount]];
  const Empty = ({ icon: I, title, text }) => (<div className="no-enquiries"><I size={45} /><h3>{title}</h3><p>{text}</p></div>);

  return (
    <>
      <Navbar />
      <main className="admin-page">
        <div className="admin-heading">
          <div><p>ADMINISTRATION</p><h1>Admin Dashboard</h1><span>Orders, enquiries, wishlist and products in one place.</span></div>
          <button onClick={load} className="refresh-btn"><RefreshCw size={17} /> {loading ? "Loading…" : "Refresh"}</button>
        </div>

        <section className="admin-stats admin-stats-4">
          {stats.map(([I, label, n]) => (<div className="stat-card" key={label}><div className="stat-icon"><I /></div><div><p>{label}</p><h2>{n}</h2></div></div>))}
        </section>

        <div className="admin-tabs" role="tablist">
          {[["orders", "Orders", orders.length], ["enquiries", "Enquiries", enquiries.length], ["wishlist", "Wishlist", wishlist.length], ["products", "Products", productCount]].map(([k, l, n]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l} <b>{n}</b></button>
          ))}
        </div>

        <section className="admin-table-section">
          {tab === "orders" && (<>
            <div className="table-heading"><h2>Customer orders</h2><span>{orders.length} records</span></div>
            {errors.orders && <p className="admin-warn">{errors.orders}</p>}
            {orders.length === 0 ? <Empty icon={ShoppingBag} title="No orders to show" text="Orders placed at checkout appear here." /> : (
              <div className="table-wrapper"><table className="enquiry-table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Placed</th><th>Status</th></tr></thead><tbody>
                {orders.map((o) => (<tr key={o.orderId || o.id}>
                  <td><b>{o.orderId || o.id}</b><div><small>{o.paymentMethod}</small></div></td>
                  <td>{o.customer?.name || o.customerName || "—"}<div><small>{o.customer?.phone || o.phone}</small></div></td>
                  <td>{(o.items || []).map((i) => <div key={i.productId}>{i.name || i.productName} × {i.quantity}</div>)}</td>
                  <td>{o.total ? inr(o.total) : "To confirm"}</td><td>{when(o.placedAt || o.createdAt)}</td>
                  <td><select className="admin-select" value={o.status || "PLACED"} onChange={(e) => setOrderStatus(o, e.target.value)}>{ORDER_STATUS.map((s) => <option key={s}>{s}</option>)}</select></td>
                </tr>))}
              </tbody></table></div>)}
          </>)}

          {tab === "enquiries" && (<>
            <div className="table-heading"><h2>Customer enquiries</h2><span>{enquiries.length} records</span></div>
            {errors.enquiries && <p className="admin-warn">{errors.enquiries}</p>}
            {enquiries.length === 0 ? <Empty icon={ClipboardList} title="No enquiries found" text="Enquiries sent from the Enquiry page appear here." /> : (
              <div className="table-wrapper"><table className="enquiry-table"><thead><tr><th>#</th><th>Customer</th><th>Organisation</th><th>Requirement</th><th>Received</th><th>Status</th></tr></thead><tbody>
                {enquiries.map((e) => (<tr key={e.id}>
                  <td>#{e.id}</td><td><b>{e.customerName}</b><div>{e.email}</div><small>{e.phone}</small></td><td>{e.organization || "—"}</td>
                  <td>{e.message}{(e.items || []).map((i) => <div key={i.productId}><small>{i.productName || i.name || `Product ${i.productId}`} × {i.quantity}</small></div>)}</td>
                  <td>{when(e.createdAt)}</td>
                  <td><select className="admin-select" value={e.status || "NEW"} onChange={(ev) => setEnqStatus(e, ev.target.value)}>{ENQ_STATUS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></td>
                </tr>))}
              </tbody></table></div>)}
          </>)}

          {tab === "wishlist" && (<>
            <div className="table-heading"><h2>Wishlisted products</h2><span>{wishRows.length} saves</span></div>
            {wishSource === "device" && <p className="admin-warn">Showing wishlist items saved in this browser only. To collect wishlists from every customer, add the wishlist endpoints from BACKEND-NOTES.md.</p>}
            {wishlist.length === 0 ? <Empty icon={Heart} title="No wishlisted products" text="Products customers save with the heart icon appear here." /> : (
              <div className="table-wrapper"><table className="enquiry-table"><thead><tr><th>Product</th><th>Price</th><th>Saved by</th><th>Customers</th></tr></thead><tbody>
                {wishlist.map((w) => (<tr key={w.id}><td><b>{w.name}</b></td><td>{inr(w.price)}</td><td>{w.count} {w.count === 1 ? "customer" : "customers"}</td><td>{[...w.who].map((x) => <div key={x}>{x}</div>)}{w.who.size === 0 && "—"}</td></tr>))}
              </tbody></table></div>)}
          </>)}

          {tab === "products" && <AdminProducts onChanged={load} />}
        </section>
      </main>
    </>
  );
}
const isAdminUser = (u) => !!u && (u.role === "ADMIN" || u.role === "ROLE_ADMIN" || u.admin === true || u.isAdmin === true || (Array.isArray(u.roles) && u.roles.some((r) => String(r).includes("ADMIN"))));

// Hidden page: customers never see a link to it. Open it by typing /admin in the address bar.
function Admin() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(() => sessionStorage.getItem("gs_admin") === "1");
  const [code, setCode] = useState("");
  const [bad, setBad] = useState(false);
  const secret = import.meta.env.VITE_ADMIN_PASSCODE;
  if (loading) return null;
  if (open || isAdminUser(user)) return <AdminDashboard />;
  const submit = (e) => {
    e.preventDefault();
    if (secret && code === secret) { sessionStorage.setItem("gs_admin", "1"); setOpen(true); } else setBad(true);
  };
  return (
    <>
      <Navbar />
      <main className="admin-page admin-lock">
        <form onSubmit={submit}>
          <Lock size={40} />
          <h1>Admin access</h1>
          <p>Enter the admin passcode to continue.</p>
          <input type="password" value={code} autoFocus onChange={(e) => { setCode(e.target.value); setBad(false); }} placeholder="Admin passcode" aria-label="Admin passcode" />
          {bad && <em role="alert">{secret ? "Wrong passcode." : "No passcode is set. Add VITE_ADMIN_PASSCODE to frontend/.env and restart."}</em>}
          <button type="submit">Open dashboard</button>
        </form>
      </main>
    </>
  );
}
export default Admin;
