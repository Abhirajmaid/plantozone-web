function formatStepDate(dateStr) {
  if (!dateStr) return { date: "—", time: "" };
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return { date: String(dateStr), time: "" };
  return {
    date: d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function resolveProgressLevel(shiprocketStatus, strapiStatus) {
  const s = String(shiprocketStatus || "").toUpperCase();

  if (s.includes("DELIVERED")) return 5;
  if (
    s.includes("OUT FOR DELIVERY") ||
    s.includes("IN TRANSIT") ||
    s.includes("PICKED UP") ||
    s.includes("REACHED")
  ) {
    return 4;
  }
  if (
    s.includes("PICKUP") ||
    s.includes("AWB") ||
    s.includes("LABEL") ||
    s.includes("MANIFEST") ||
    s.includes("READY TO SHIP")
  ) {
    return 3;
  }
  if (s && !s.includes("CANCEL") && !s.includes("RTO")) return 2;
  if (strapiStatus === "paid") return 2;
  return 1;
}

export function buildTrackingPayload({
  orderId,
  strapiOrder,
  shiprocketOrder,
  awbTracking,
}) {
  const attrs = strapiOrder?.attributes || {};
  const items = Array.isArray(attrs.items) ? attrs.items : [];

  const shipStatus =
    awbTracking?.tracking_data?.shipment_status ||
    shiprocketOrder?.status ||
    "";

  const progressLevel = resolveProgressLevel(shipStatus, attrs.status);
  const placed = formatStepDate(attrs.createdAt);

  const stepDefs = [
    { id: 1, label: "Order Placed", iconKey: "package", level: 1 },
    { id: 2, label: "Confirmed", iconKey: "check", level: 2 },
    { id: 3, label: "Processing", iconKey: "loader", level: 3 },
    { id: 4, label: "On the Way", iconKey: "truck", level: 4 },
    { id: 5, label: "Delivered", iconKey: "home", level: 5 },
  ];

  const steps = stepDefs.map((step) => {
    const completed = progressLevel >= step.level;
    return {
      id: step.id,
      label: step.label,
      iconKey: step.iconKey,
      completed,
      date:
        completed && step.id === 1
          ? placed.date
          : completed
            ? "Updated"
            : "Expected",
      time: completed && step.id === 1 ? placed.time : "",
    };
  });

  const trackActivities =
    awbTracking?.tracking_data?.shipment_track_activities ||
    awbTracking?.tracking_data?.shipment_track ||
    [];

  const timeline = Array.isArray(trackActivities)
    ? trackActivities.map((ev) => ({
        date: ev.date || ev.activity_date || "",
        activity: ev.activity || ev.status || "Update",
        location: ev.location || "",
      }))
    : [];

  const awb =
    awbTracking?.tracking_data?.awb_code || shiprocketOrder?.awb_code || null;

  return {
    orderId: attrs.orderId || orderId,
    status: shipStatus || attrs.status || "Processing",
    paymentStatus: attrs.status,
    awb,
    courier: shiprocketOrder?.courier_name || null,
    etd: shiprocketOrder?.etd || null,
    steps,
    products: items.map((item, idx) => ({
      id: idx + 1,
      name: item.title || item.name || "Product",
      type: [item.size, item.shape].filter(Boolean).join(" · ") || "Plant",
      image: item.image || "/images/plant.png",
      quantity: item.quantity || 1,
      price: item.price || 0,
    })),
    shipping: {
      name: attrs.userName,
      email: attrs.userEmail,
      phone: attrs.userPhone,
      address: attrs.address,
      city: attrs.city,
      state: attrs.state,
      pincode: attrs.pincode,
    },
    total: attrs.total,
    timeline,
    shiprocketFound: !!shiprocketOrder,
  };
}
