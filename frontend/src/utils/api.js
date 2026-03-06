const BASE = import.meta.env.VITE_API_URL || "";

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...opts.headers },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Auth
  getMe: () => req("/me"),
  signup: (data) => req("/signup", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => req("/login", { method: "POST", body: JSON.stringify(data) }),
  logout: () => req("/logout"),

  // Profile
  getProfile: () => req("/users/me"),

  // Listings
  getListings: () => req("/listings"),
  getListing: (id) => req(`/listings/${id}`),
  createListing: (fd) => fetch(`${BASE}/listings`, { method: "POST", credentials: "include", body: fd }).then(async r => { if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.message || `HTTP ${r.status}`); } return r.json(); }),
  updateListing: (id, fd) => fetch(`${BASE}/listings/${id}?_method=PUT`, { method: "POST", credentials: "include", body: fd }).then(async r => { if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.message || `HTTP ${r.status}`); } return r.json(); }),
  deleteListing: (id) => req(`/listings/${id}`, { method: "DELETE" }),

  // Reviews
  createReview: (lid, data) => req(`/listings/${lid}/reviews`, { method: "POST", body: JSON.stringify(data) }),
  deleteReview: (lid, rid) => req(`/listings/${lid}/reviews/${rid}`, { method: "DELETE" }),
};