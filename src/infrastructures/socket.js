import React, { useContext } from "react";

import { io } from "socket.io-client";
import { AuthContext } from "../navigation/AuthProvider";

// URL de votre serveur Socket.IO



const {token} = useContext(AuthContext)

const SOCKET_URL = "https://grouping.glitch.me"; // Remplacez par votre URL réelle

// Créer l'instance Socket.IO

const socket = io(SOCKET_URL, {
  auth: {
    token, // Ajoutez ici votre token JWT
  },
  
  transports: ["websocket"], // Forcer l'utilisation du protocole WebSocket
  reconnection: true, // Activer la reconnexion automatique
  reconnectionAttempts: 5, // Nombre de tentatives de reconnexion
  timeout: 20000, // Augmenter le délai (par défaut, c'est 5000 ms)

});

export default socket;
