import { io } from "socket.io-client";
import { SOCKET_URL } from "../config/api";

export const createChatSocket = (token) => {
  return io(SOCKET_URL, {
    transports: ["websocket"],     // ✅ important sur téléphone
    auth: { token },              // ✅ obligatoire pour ton io.use(jwt)
    autoConnect: false,           // ✅ on connecte dans la page chat
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });
};
