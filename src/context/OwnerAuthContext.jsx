import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const OwnerAuthContext = createContext()

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const normalizeToken = (value) => {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed) return ''
  return trimmed.replace(/^Bearer\s+/i, '')
}

export function OwnerAuthProvider({ children }) {
  const [isOwner, setIsOwner] = useState(() => Boolean(localStorage.getItem('ownerToken')))
  const [token, setToken] = useState(() => normalizeToken(localStorage.getItem('ownerToken')))
  const [loading, setLoading] = useState(true)

  const logout = () => {
    setIsOwner(false)
    setToken(null)
    localStorage.removeItem('ownerToken')
  }

  const validateStoredToken = useCallback(async (storedToken) => {
    if (!storedToken) return false

    try {
      const res = await fetch(`${API_URL}/owner/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
      })

      const data = await res.json()
      return res.ok && data.success
    } catch (error) {
      console.error('Token validation failed:', error)
      return false
    }
  }, [])

  const handleResponse = useCallback(async (res) => {
    let data
    try {
      data = await res.json()
    } catch (err) {
      // non-JSON response
      if (res.status === 401) {
        logout()
        throw new Error('Invalid token')
      }
      throw new Error(res.statusText || 'Request failed')
    }

    if (res.status === 401) {
      logout()
      throw new Error(data.message || 'Invalid token')
    }

    if (!res.ok || !data.success) {
      throw new Error(data.message || res.statusText || 'Request failed')
    }

    return data
  }, [logout])

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = normalizeToken(localStorage.getItem('ownerToken'))
      if (!storedToken) {
        setLoading(false)
        return
      }

      const valid = await validateStoredToken(storedToken)
      if (valid) {
        setToken(storedToken)
        setIsOwner(true)
      } else {
        logout()
      }
      setLoading(false)
    }

    initializeAuth()
  }, [validateStoredToken])

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

      const nextToken = normalizeToken(data.token)
      setToken(nextToken)
      setIsOwner(true)
      localStorage.setItem('ownerToken', nextToken)
      return data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }


  const updateContent = useCallback(async (contentId, content) => {
    try {
      const res = await fetch(`${API_URL}/content/${contentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content }),
      })

      const data = await handleResponse(res)
      return data
    } catch (error) {
      console.error('Update failed:', error)
      throw error
    }
  }, [token])

  const getPageContent = useCallback(async (page) => {
    try {
      const res = await fetch(`${API_URL}/content/${page}`, {
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await handleResponse(res)
      return data.content || []
    } catch (error) {
      console.error('Fetch page content failed:', error)
      throw error
    }
  }, [])

  const savePageContent = useCallback(async (page, key, value, label = key) => {
    try {
      const res = await fetch(`${API_URL}/content/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ page, label, content: value }),
      })

      const data = await handleResponse(res)
      return data.content
    } catch (error) {
      console.error('Save page content failed:', error)
      throw error
    }
  }, [token])

  // ── CARD MANAGEMENT FUNCTIONS ──────────────────────────────
  const getCards = async (cardType, page = 'achievements') => {
    try {
      const res = await fetch(`${API_URL}/cards?cardType=${cardType}&page=${page}`, {
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await handleResponse(res)
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
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ cardType, page, data: cardData }),
      })

      const data = await handleResponse(res)
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
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ data: cardData }),
      })

      const data = await handleResponse(res)
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
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      const data = await handleResponse(res)
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
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ cardType, page, cardIds }),
      })

      const data = await handleResponse(res)
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
    getPageContent,
    savePageContent,
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


