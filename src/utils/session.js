export const getSessionKey = () => {
  let key = localStorage.getItem("session_key");

  if (!key) {
    // Use crypto.randomUUID when available; fall back to a simple UUIDv4 generator otherwise
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      key = crypto.randomUUID();
    } else {
      // fallback UUIDv4
      key = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
    localStorage.setItem("session_key", key);
  }

  return key;
};