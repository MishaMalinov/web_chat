export default {
    apiUrl: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api",
    wssUrl: import.meta.env.VITE_WSS_URL ?? "ws://localhost:10000",
};
  