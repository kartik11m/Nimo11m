export function getPreviewItems(entries, mapper, limit = 3) {
  if (!Array.isArray(entries)) return []

  const items = entries
    .map((entry, index) => {
      const source = entry?.data ?? entry
      const mapped = mapper ? mapper(source, entry, index) : source

      if (!mapped) return null

      const hasUsableValue = Object.values(mapped).some((value) => {
        if (typeof value === 'string') return value.trim() !== ''
        if (Array.isArray(value)) return value.length > 0
        if (typeof value === 'number' || typeof value === 'boolean') return true
        return value !== null && value !== undefined
      })

      return hasUsableValue ? mapped : null
    })
    .filter(Boolean)

  return items.slice(0, limit)
}
