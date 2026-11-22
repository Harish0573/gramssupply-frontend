// Opens a printable receipt for an order in a new tab.
// The customer can press "Print / Save as PDF" to keep a copy.

const methodNames = {
  upi: "UPI",
  card: "Debit / Credit card",
  netbanking: "Net banking",
  bank: "Bank transfer / PO",
  cod: "Cash on delivery",
};

const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

const money = (n) =>
  n == null || n === "" || Number.isNaN(Number(n))
    ? null
    : `₹${Number(n).toLocaleString("en-IN")}`;

export function openReceipt(order) {
  if (!order) return;
  const c = order.customer || {};
  const items = order.items || [];
  const placed = order.placedAt ? new Date(order.placedAt) : new Date();
  const date = placed.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const rows = items
    .map((item) => {
      const unit = money(item.price ?? item.unitPrice);
      const line = money(
        item.lineTotal ??
          (item.price != null ? item.price * item.quantity : null),
      );
      return `<tr>
        <td>${esc(item.name)}</td>
        <td class="num">${esc(item.quantity)}</td>
        <td class="num">${unit || "On request"}</td>
        <td class="num">${line || "On request"}</td>
      </tr>`;
    })
    .join("");

  const total = money(order.total);
  const address = [c.address, c.city, c.district, c.state]
    .filter(Boolean)
    .join(", ");

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Receipt ${esc(order.orderId)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1f1030; margin: 0; padding: 32px; font-size: 18px; line-height: 1.5; }
  .receipt { max-width: 820px; margin: 0 auto; border: 2px solid #5b2a86; border-radius: 12px; padding: 32px; }
  header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; border-bottom: 2px solid #e3dcee; padding-bottom: 18px; margin-bottom: 18px; }
  h1 { margin: 0; font-size: 30px; color: #5b2a86; }
  h2 { margin: 0 0 6px; font-size: 20px; }
  .brand small { display: block; color: #5a4d68; font-size: 16px; }
  .meta { text-align: right; font-size: 17px; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 22px; }
  .cols p { margin: 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { padding: 12px 10px; border-bottom: 1px solid #e3dcee; text-align: left; font-size: 17px; }
  th { background: #f0e8fa; }
  .num { text-align: right; white-space: nowrap; }
  .total td { font-weight: 700; font-size: 20px; border-top: 2px solid #5b2a86; border-bottom: 0; }
  .note { margin-top: 22px; color: #5a4d68; font-size: 16px; }
  .actions { max-width: 820px; margin: 0 auto 18px; display: flex; gap: 12px; }
  .actions button { padding: 12px 22px; font-size: 18px; font-weight: 700; border: 0; border-radius: 8px; background: #5b2a86; color: #fff; cursor: pointer; }
  .actions button.alt { background: #eee6f7; color: #3c0f5e; }
  @media print { .actions { display: none; } body { padding: 0; } .receipt { border: 0; } }
</style></head>
<body>
  <div class="actions">
    <button onclick="window.print()">Print / Save as PDF</button>
    <button class="alt" onclick="window.close()">Close</button>
  </div>
  <div class="receipt">
    <header>
      <div class="brand">
        <h1>GramSupply.</h1>
        <small>Institutional marketplace</small>
      </div>
      <div class="meta">
        <strong>Order receipt</strong><br />
        Order no: <strong>${esc(order.orderId)}</strong><br />
        ${esc(date)}
      </div>
    </header>

    <div class="cols">
      <div>
        <h2>Delivering to</h2>
        <p>${esc(c.name)}${c.organisation ? `<br />${esc(c.organisation)}` : ""}<br />
        ${esc(address)}${c.pincode ? ` - ${esc(c.pincode)}` : ""}<br />
        Mobile: ${esc(c.phone)}${c.email ? `<br />${esc(c.email)}` : ""}</p>
      </div>
      <div>
        <h2>Payment</h2>
        <p>${esc(methodNames[order.paymentMethod] || order.paymentMethod || "-")}${
          order.cardLast4 ? ` ending ${esc(order.cardLast4)}` : ""
        }<br />Status: ${esc(order.status || "PLACED")}</p>
      </div>
    </div>

    <table>
      <thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Price</th><th class="num">Amount</th></tr></thead>
      <tbody>${rows}
        <tr class="total"><td colspan="3">Total</td><td class="num">${total || "To be confirmed"}</td></tr>
      </tbody>
    </table>

    <p class="note">Thank you for ordering with GramSupply. Our team will call you to confirm delivery${
      total ? "" : " and the final price"
    }.</p>
  </div>
</body></html>`;

  const w = window.open("", "_blank");
  if (!w) {
    alert("Please allow pop-ups to view your receipt.");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}
