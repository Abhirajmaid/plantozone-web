"use client";

export default function OrderInvoice({ order, estimatedDelivery }) {
  const items = Array.isArray(order?.items) ? order.items : [];

  return (
    <div id="order-invoice" className="hidden print:block p-8 text-gray-900 bg-white">
      <div className="flex justify-between items-start border-b pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-green-700">Plantozone</h1>
          <p className="text-sm text-gray-600 mt-1">Order Invoice</p>
        </div>
        <div className="text-right text-sm">
          <p>
            <span className="text-gray-500">Order ID:</span> {order.orderId}
          </p>
          <p>
            <span className="text-gray-500">Payment ID:</span>{" "}
            {order.paymentId || "—"}
          </p>
          <p>
            <span className="text-gray-500">Date:</span>{" "}
            {order.placedAt
              ? new Date(order.placedAt).toLocaleString("en-IN")
              : new Date().toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {(order.userName || order.email) && (
        <div className="mb-6 text-sm">
          <p className="font-semibold">Bill to</p>
          <p>{order.userName}</p>
          {order.email && <p>{order.email}</p>}
          {order.userPhone && <p>{order.userPhone}</p>}
          {order.address && <p className="mt-1">{order.address}</p>}
          {(order.city || order.pincode) && (
            <p>
              {[order.city, order.state].filter(Boolean).join(", ")}{" "}
              {order.pincode}
            </p>
          )}
        </div>
      )}

      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Item</th>
            <th className="py-2">Qty</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            const qty = item.quantity || 1;
            const line = Number(item.price || 0) * qty;
            return (
              <tr key={idx} className="border-b border-gray-100">
                <td className="py-2">
                  {item.title || item.name || "Plant"}
                  {item.size ? ` (${item.size})` : ""}
                </td>
                <td className="py-2">{qty}</td>
                <td className="py-2 text-right">₹{line.toLocaleString("en-IN")}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="text-sm space-y-1 max-w-xs ml-auto">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{Number(order.subtotal || 0).toLocaleString("en-IN")}</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between text-green-700">
            <span>Discount</span>
            <span>-₹{Number(order.discountAmount).toLocaleString("en-IN")}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base border-t pt-2">
          <span>Total paid</span>
          <span>₹{Number(order.total || 0).toLocaleString("en-IN")}</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-8">
        Payment: {order.paymentMethod || "Razorpay (Online)"} · Estimated delivery:{" "}
        {estimatedDelivery}
      </p>
    </div>
  );
}
