import api from "./api";

export const getCartApi = async (guestId) => (await api.get("/cart", { headers: guestId ? { "x-guest-id": guestId } : {} })).data;
export const upsertCartItemApi = async (payload, guestId) => (await api.post("/cart/items", payload, { headers: guestId ? { "x-guest-id": guestId } : {} })).data;
export const mergeCartApi = async (guestId) => (await api.post("/cart/merge", {}, { headers: { "x-guest-id": guestId } })).data;
export const clearRemoteCartApi = async (guestId) => (await api.delete("/cart", { headers: guestId ? { "x-guest-id": guestId } : {} })).data;
