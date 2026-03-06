import React, { createContext, useEffect, useState } from 'react'


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

    }}>
        {children}
    </AuthContext.Provider>
  )
}
