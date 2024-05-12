import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    // Optionally clear session on server too
  }

  const value = {
    user,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
