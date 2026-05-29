import nodemailer from "nodemailer";
import { Resend } from "resend";

const FROM_EMAIL =
  process.env.ORDER_EMAIL_FROM || "Plantozone <noreply@plantozone.com>";
const ADMIN_EMAIL =
  process.env.ORDER_EMAIL_ADMIN || "plantozonegreenindia@gmail.com";
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${ADMIN_EMAIL}`;

function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatAddress(order) {
  const parts = [
    order.address,
    order.address2,
    [order.city, order.state].filter(Boolean).join(", "),
    order.pincode,
  ].filter(Boolean);
  return parts.join("\n") || "—";
}

function formatItemsText(items) {
  if (!Array.isArray(items) || items.length === 0) return "No items";
  return items
    .map((item, i) => {
      const name = item.title || item.name || "Product";
      const qty = item.quantity || 1;
      const price = Number(item.price || 0);
      return `${i + 1}. ${name} × ${qty} — ${formatCurrency(price * qty)}`;
    })
    .join("\n");
}

function formatItemsHtml(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "<p>No items listed.</p>";
  }
  const rows = items
    .map((item) => {
      const name = item.title || item.name || "Product";
      const qty = item.quantity || 1;
      const price = Number(item.price || 0);
      const extras = [item.size, item.shape].filter(Boolean).join(", ");
      return `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;">${name}${extras ? `<br><span style="color:#666;font-size:12px;">${extras}</span>` : ""}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;">${qty}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">${formatCurrency(price * qty)}</td>
      </tr>`;
    })
    .join("");
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;">
    <thead><tr style="background:#f0fdf4;">
      <th style="padding:10px 12px;text-align:left;">Product</th>
      <th style="padding:10px 12px;text-align:center;">Qty</th>
      <th style="padding:10px 12px;text-align:right;">Amount</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

export function buildOrderEmailText(order) {
  const trackUrl = `${getSiteUrl()}/track-order?orderId=${encodeURIComponent(order.orderId)}&email=${encodeURIComponent(order.userEmail)}`;
  const customerName = [order.userName, order.userLastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return `Hi ${customerName || "there"},

Thank you for shopping with Plantozone! Your order has been confirmed.

ORDER ID: ${order.orderId}
Payment ID: ${order.paymentId || "—"}
Status: ${order.status || "Paid"}

ITEMS:
${formatItemsText(order.items)}

Subtotal: ${formatCurrency(order.subtotal)}
${order.discountAmount ? `Discount (${order.discountCode || "applied"}): -${formatCurrency(order.discountAmount)}\n` : ""}Total: ${formatCurrency(order.total)}

DELIVERY ADDRESS:
${formatAddress(order)}

Contact: ${order.userPhone || "—"}

Track your order: ${trackUrl}

Questions? Email info@plantozone.com or call +91 90591 52555.

— Plantozone Team`;
}

export function buildOrderEmailHtml(order) {
  const trackUrl = `${getSiteUrl()}/track-order?orderId=${encodeURIComponent(order.orderId)}&email=${encodeURIComponent(order.userEmail)}`;
  const customerName = [order.userName, order.userLastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 12px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#0b9c09;padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;">Order Confirmed 🌿</h1>
            <p style="margin:8px 0 0;color:#e8f5e9;font-size:14px;">Thank you for choosing Plantozone</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px;color:#333;font-size:15px;">Hi <strong>${customerName || "Customer"}</strong>,</p>
            <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.5;">We've received your payment and your order is confirmed. Save your <strong>Order ID</strong> below to track delivery.</p>

            <table width="100%" style="background:#f0fdf4;border-radius:8px;margin-bottom:24px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 6px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Order ID</p>
                <p style="margin:0;color:#0b9c09;font-size:18px;font-weight:bold;word-break:break-all;">${order.orderId}</p>
                ${order.paymentId ? `<p style="margin:10px 0 0;color:#666;font-size:13px;">Payment ref: ${order.paymentId}</p>` : ""}
              </td></tr>
            </table>

            <h2 style="margin:0 0 12px;font-size:16px;color:#222;">Order items</h2>
            ${formatItemsHtml(order.items)}

            <table width="100%" style="margin-top:20px;font-size:14px;">
              <tr><td style="padding:6px 0;color:#666;">Subtotal</td><td style="padding:6px 0;text-align:right;">${formatCurrency(order.subtotal)}</td></tr>
              ${order.discountAmount ? `<tr><td style="padding:6px 0;color:#666;">Discount</td><td style="padding:6px 0;text-align:right;color:#0b9c09;">-${formatCurrency(order.discountAmount)}</td></tr>` : ""}
              <tr><td style="padding:10px 0 0;font-weight:bold;font-size:16px;">Total paid</td><td style="padding:10px 0 0;text-align:right;font-weight:bold;font-size:16px;color:#0b9c09;">${formatCurrency(order.total)}</td></tr>
            </table>

            <h2 style="margin:28px 0 10px;font-size:16px;color:#222;">Delivery address</h2>
            <p style="margin:0;color:#555;font-size:14px;line-height:1.6;white-space:pre-line;">${formatAddress(order).replace(/\n/g, "<br>")}</p>
            <p style="margin:8px 0 0;color:#555;font-size:14px;">Phone: ${order.userPhone || "—"}</p>

            <table width="100%" style="margin-top:28px;">
              <tr><td align="center">
                <a href="${trackUrl}" style="display:inline-block;background:#0b9c09;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:bold;font-size:15px;">Track your order</a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:#fafafa;border-top:1px solid #eee;text-align:center;">
            <p style="margin:0;color:#888;font-size:12px;line-height:1.5;">Questions? <a href="mailto:info@plantozone.com" style="color:#0b9c09;">info@plantozone.com</a> · +91 90591 52555</p>
            <p style="margin:8px 0 0;color:#aaa;font-size:11px;">© Plantozone — Bringing nature closer to you</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendViaResend(order) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const resend = new Resend(apiKey);
  const subject = `Order Confirmed — ${order.orderId} | Plantozone`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.userEmail,
    subject,
    html: buildOrderEmailHtml(order),
    text: buildOrderEmailText(order),
  });

  return true;
}

async function sendViaSmtp(order) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return false;

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: FROM_EMAIL,
    to: order.userEmail,
    subject: `Order Confirmed — ${order.orderId} | Plantozone`,
    html: buildOrderEmailHtml(order),
    text: buildOrderEmailText(order),
  });

  return true;
}

async function sendViaFormSubmit(order) {
  const customerName = [order.userName, order.userLastName]
    .filter(Boolean)
    .join(" ");

  const payload = {
    _subject: `New order ${order.orderId} — Plantozone`,
    _template: "table",
    email: order.userEmail,
    _autoresponse: buildOrderEmailText(order),
    _captcha: "false",
    "Order ID": order.orderId,
    "Payment ID": order.paymentId || "—",
    "Customer": customerName,
    "Email": order.userEmail,
    "Phone": order.userPhone || "—",
    "Address": formatAddress(order).replace(/\n/g, ", "),
    "Subtotal": formatCurrency(order.subtotal),
    "Discount": order.discountAmount
      ? `-${formatCurrency(order.discountAmount)} (${order.discountCode || ""})`
      : "—",
    "Total": formatCurrency(order.total),
    "Items": formatItemsText(order.items).replace(/\n/g, " | "),
  };

  const res = await fetch(FORMSUBMIT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(err || `FormSubmit failed (${res.status})`);
  }

  return true;
}

export async function sendOrderConfirmationEmail(order) {
  if (!order?.userEmail || !order?.orderId) {
    throw new Error("Missing order email or order ID");
  }

  if (await sendViaResend(order)) return { provider: "resend" };
  if (await sendViaSmtp(order)) return { provider: "smtp" };
  await sendViaFormSubmit(order);
  return { provider: "formsubmit" };
}
