import { createContext, useContext, useState, useEffect } from 'react'

const OwnerAuthContext = createContext()

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function OwnerAuthProvider({ children }) {
  const [isOwner, setIsOwner] = useState(false)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('ownerToken')
    if (storedToken) {
      setToken(storedToken)
      setIsOwner(true)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/owner/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!data.success) throw new Error(data.message)

      setToken(data.token)
      setIsOwner(true)
      localStorage.setItem('ownerToken', data.token)
      return data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setIsOwner(false)
    setToken(null)
    localStorage.removeItem('ownerToken')
  }

  const updateContent = async (contentId, content) => {
    try {
      const res = await fetch(`${API_URL}/content/${contentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      return data
    } catch (error) {
      console.error('Update failed:', error)
      throw error
    }
  }

  const value = {
    isOwner,
    token,
    loading,
    login,
    logout,
    updateContent,
  }

  return (
    <OwnerAuthContext.Provider value={value}>{children}</OwnerAuthContext.Provider>
  )
}

export function useOwnerAuth() {
  const context = useContext(OwnerAuthContext)
  if (!context) {
    throw new Error('useOwnerAuth must be used within OwnerAuthProvider')
  }
  return context
}
