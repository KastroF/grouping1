// services/socket.js
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

let socket = null;

export const connectSocket = async () => {
  const token = await AsyncStorage.getItem('token'); // ou ton auth context
  socket = io('http://<TON_BACKEND>:3000', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 3000,
    auth: { token },
  });

  socket.on('connect', () => {
    console.log('✅ Socket connecté :', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('⚠️ Socket déconnecté :', reason);
  });

  socket.on('connect_error', (err) => {
    console.log('❌ Erreur de connexion socket :', err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
