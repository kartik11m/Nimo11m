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

  // ── CARD MANAGEMENT FUNCTIONS ──────────────────────────────
  const getCards = async (cardType, page = 'achievements') => {
    try {
      const res = await fetch(`${API_URL}/cards?cardType=${cardType}&page=${page}`, {
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      return data.data
    } catch (error) {
      console.error('Fetch cards failed:', error)
      throw error
    }
  }

  const addCard = async (cardType, cardData, page = 'achievements') => {
    try {
      const res = await fetch(`${API_URL}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cardType, page, data: cardData }),
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      return data.data
    } catch (error) {
      console.error('Add card failed:', error)
      throw error
    }
  }

  const updateCard = async (cardId, cardData) => {
    try {
      const res = await fetch(`${API_URL}/cards/${cardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: cardData }),
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      return data.data
    } catch (error) {
      console.error('Update card failed:', error)
      throw error
    }
  }

  const deleteCard = async (cardId) => {
    try {
      const res = await fetch(`${API_URL}/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      return data
    } catch (error) {
      console.error('Delete card failed:', error)
      throw error
    }
  }

  const reorderCards = async (cardType, page, cardIds) => {
    try {
      const res = await fetch(`${API_URL}/cards/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cardType, page, cardIds }),
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      return data.data
    } catch (error) {
      console.error('Reorder cards failed:', error)
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
    getCards,
    addCard,
    updateCard,
    deleteCard,
    reorderCards,
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
