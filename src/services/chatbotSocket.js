import { io } from "socket.io-client";

const CHATBOT_URL = "https://grouping.binaire-backend.tech";

export const createChatbotSocket = () => {
  return io(CHATBOT_URL, {
    transports: ["websocket"],
    autoConnect: false,
    timeout: 10000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 5000,
  });
};
