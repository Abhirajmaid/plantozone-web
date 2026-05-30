const GUEST_EMAIL_KEY = "plantozone_guest_email";

/** Remember checkout email so guest can view orders without signing in */
export function saveGuestEmail(email) {
  if (typeof window === "undefined" || !email) return;
  localStorage.setItem(GUEST_EMAIL_KEY, String(email).trim().toLowerCase());
  window.dispatchEvent(new Event("orders-updated"));
}

export function getGuestEmail() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(GUEST_EMAIL_KEY) || "";
}

export function getEmailFromLastOrder() {
  if (typeof window === "undefined") return "";
  try {
    const raw = sessionStorage.getItem("lastOrder");
    if (!raw) return "";
    const o = JSON.parse(raw);
    return (o.email || "").trim().toLowerCase();
  } catch {
    return "";
  }
}

/** Best email to load orders: logged-in user → saved guest → last checkout */
export function resolveOrdersEmail() {
  if (typeof window === "undefined") return "";

  try {
    const rawUser = sessionStorage.getItem("user");
    if (rawUser) {
      const u = JSON.parse(rawUser);
      if (u?.email) return String(u.email).trim().toLowerCase();
    }
  } catch {
    /* ignore */
  }

  return getGuestEmail() || getEmailFromLastOrder();
}
