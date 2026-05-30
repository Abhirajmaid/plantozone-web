/**
 * Promo CRUD via Next.js API (server uses Strapi token — avoids 403 from browser).
 */

function authHeaders(token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function parseResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error?.message || data?.message || "Request failed");
    err.response = { status: res.status, data: { error: data?.error || data } };
    throw err;
  }
  return { data };
}

const getPromoCodes = (token, params = {}) => {
  const sp = new URLSearchParams();
  if (params.pageSize) sp.set("pageSize", params.pageSize);
  if (params.search) sp.set("search", params.search);
  const qs = sp.toString();
  return fetch(`/api/admin/promo-codes${qs ? `?${qs}` : ""}`, {
    headers: authHeaders(token),
  }).then(parseResponse);
};

const createPromoCode = (payload, token) =>
  fetch("/api/admin/promo-codes", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ data: payload }),
  }).then(parseResponse);

const updatePromoCode = (id, payload, token) =>
  fetch(`/api/admin/promo-codes/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ data: payload }),
  }).then(parseResponse);

const deletePromoCode = (id, token) =>
  fetch(`/api/admin/promo-codes/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  }).then(parseResponse);

export default {
  getPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
};
