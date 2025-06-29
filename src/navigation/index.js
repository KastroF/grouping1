import React from 'react'
import AuthProvider from './AuthProvider'
import Routes from './Routes'
import { SocketProvider } from './SocketProv'

export default function Provider() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes />
      </SocketProvider>
    </AuthProvider>
  )
}
