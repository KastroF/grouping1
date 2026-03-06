import React, { createContext, useCallback, useState } from 'react'
import notifee from '@notifee/react-native';
import { API } from '../config/api';


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
  const [pendingSearch, setPendingSearch] = useState(null);

  const refreshBadgeCount = useCallback(async (tkn) => {
    const t = tkn || token;
    if (!t) return;
    try {
      const response = await fetch(API.NOTIF_NOT_READ, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${t}`,
        },
      });
      const data = await response.json();
      if (data && data.status === 0) {
        const count = data.badges || 0;
        setBadgee(count);
        await notifee.setBadgeCount(count);
        return data;
      }
    } catch (err) {
      console.log('refreshBadgeCount error:', err);
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
      pendingSearch,
      setPendingSearch,
      refreshBadgeCount,

    }}>
        {children}
    </AuthContext.Provider>
  )
}
