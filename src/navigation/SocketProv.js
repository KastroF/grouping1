import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../navigation/AuthProvider";

// Créez le contexte pour le socket
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token } = useContext(AuthContext); // Récupérer le token JWT depuis le contexte d'authentification
  const socketRef = useRef(null);

 /* useEffect(() => {


    try{

    if (token) {
      // Initialiser l'instance Socket.IO
      const socket = io("https://grouping.glitch.me/", {
        auth: { token },
        transports: ["websocket"], // Forcer WebSocket
      });

      socketRef.current = socket;

      // Gérer les événements de connexion ou d'erreur
      socket.on("connect", () => {
        console.log("Connecté au serveur Socket.IO :", socket.id);
      });

      socket.on("connect_error", (err) => {
        console.error("Erreur de connexion Socket.IO :", err.message);
      });

      // Nettoyage lors de la déconnexion ou du démontage du composant
      return () => {
        socket.disconnect();
        console.log("Déconnecté du serveur Socket.IO");
      };
    }

  }catch(err){

    console.log(err);
  
  }

  }, [token]);  */



  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
