import React, { createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client';

export const AuthContext = createContext(); 


export default function AuthProvider({children}) {

  const [isTabBarVisible, setIsTabBarVisible] = useState(false);
  const [isTabBarVisible2, setIsTabBarVisible2] = useState(false);
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(false);
  const [token, setToken] = useState(null);
  const [language, setLanguage] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [idd, setIdd] = useState(null); 
  const [userId, setUserId] = useState(null);
  const [refreshh, setRefreshh] = useState(false);
  const [badgee, setBadgee] = useState(0);
  const [refreshModify, setRefreshModify] = useState(false);
  const [socket, setSocket] = useState(null);

  // 📡 Se connecter automatiquement au socket quand le token change
  useEffect(() => {
    if (token) {
      console.log(token);
      const s = io('https://grouping.glitch.me', {
        transports: ['polling'],
        reconnection: true,
        auth: { token },
      });

      s.on('connect', () => {
        console.log('✅ Socket connecté :', s.id);
      });

      s.on('disconnect', (reason) => {
        console.log('🔌 Socket déconnecté :', reason);
      });

      s.on('connect_error', (err) => {
        console.log(token);
        console.log('❌ Erreur socket :', err.message);
      });

      setSocket(s);

      // Nettoyage à la déconnexion / changement de token
      return () => {
        s.disconnect();
        setSocket(null);
      };
    }
  }, [token]);
  

  return (
    <AuthContext.Provider value={{
      isTabBarVisible, 
      setIsTabBarVisible, 
      isTabBarVisible2, 
      setIsTabBarVisible2, 
      user, 
      setUser, 
      account, 
      setAccount, 
      token, 
      setToken, 
      language, 
      setLanguage, 
      refresh, 
      setRefresh, 
      idd, 
      setIdd, 
      userId, 
      setUserId, 
      refreshh, 
      setRefreshh, 
      badgee, 
      setBadgee, 
      refreshModify, 
      setRefreshModify, 
      socket
    }}>
        {children}
    </AuthContext.Provider>
  )
}
