const faqPalette = {
  training: { color: '#FF6B35', rgb: '255,107,53' },
  camp: { color: '#00F5FF', rgb: '0,245,255' },
  labsetup: { color: '#A855F7', rgb: '168,85,247' },
  general: { color: '#FF006E', rgb: '255,0,110' },
}

const testimonialPalette = [
  { color: '#FF6B35', rgb: '255,107,53' },
  { color: '#00F5FF', rgb: '0,245,255' },
  { color: '#A855F7', rgb: '168,85,247' },
  { color: '#FF006E', rgb: '255,0,110' },
]

const partnerPalette = [
  { color: '#FF6B35', rgb: '255,107,53' },
  { color: '#00F5FF', rgb: '0,245,255' },
  { color: '#A855F7', rgb: '168,85,247' },
  { color: '#FF006E', rgb: '255,0,110' },
]

const faqCategoryPalette = [
  { color: '#FF6B35', rgb: '255,107,53' },
  { color: '#00F5FF', rgb: '0,245,255' },
  { color: '#A855F7', rgb: '168,85,247' },
  { color: '#FF006E', rgb: '255,0,110' },
]

export function normalizeFaqItems(items = []) {
  return (items || [])
    .filter((item) => item && (item.q || item.a))
    .map((item, index) => {
      const cat = item.cat || 'general'
      const palette = faqPalette[cat] || faqPalette.general
      return {
        id: item.id || `${cat}-${index}`,
        cat,
        q: item.q || 'Untitled question',
        a: item.a || 'Add your answer here.',
        color: item.color || palette.color,
        rgb: item.rgb || palette.rgb,
      }
    })
}

export function buildFaqCategoryKey(label = '', existingCategories = []) {
  const base = (label || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const baseKey = base || 'section'
  const usedKeys = new Set((existingCategories || []).map((cat) => cat?.key).filter(Boolean))

  let candidate = baseKey
  let counter = 2

  while (usedKeys.has(candidate)) {
    candidate = `${baseKey}-${counter}`
    counter += 1
  }

  return candidate
}

export function getFaqCategoryPalette(index = 0) {
  return faqCategoryPalette[index % faqCategoryPalette.length]
}

export function normalizeFaqCategories(categories = [], fallbackCategories = []) {
  const source = Array.isArray(categories) && categories.length ? categories : fallbackCategories

  return source.map((category, index) => {
    const palette = getFaqCategoryPalette(index)
    return {
      key: category?.key || `section-${index + 1}`,
      label: category?.label || category?.key || `Section ${index + 1}`,
      color: category?.color || palette.color,
      rgb: category?.rgb || palette.rgb,
    }
  })
}

export function normalizeFaqContent(content = null, fallbackCategories = []) {
  if (Array.isArray(content)) {
    return {
      categories: normalizeFaqCategories(fallbackCategories, fallbackCategories),
      items: normalizeFaqItems(content),
    }
  }

  const categories = normalizeFaqCategories(Array.isArray(content?.categories) ? content.categories : [], fallbackCategories)
  const items = normalizeFaqItems(Array.isArray(content?.items) ? content.items : [])

  return { categories, items }
}

export function normalizeTestimonials(items = []) {
  return (items || [])
    .filter((item) => item && (item.quote || item.name))
    .map((item, index) => {
      const palette = testimonialPalette[index % testimonialPalette.length]
      const track = item.track || (item.course?.toLowerCase().includes('ros') ? 'Robotics' : 'Hardware')
      return {
        id: item.id || `${item.name || 'testimonial'}-${index}`,
        quote: item.quote || 'A great learning experience.',
        name: item.name || 'Student',
        age: item.age || 16,
        city: item.city || 'Bhopal',
        course: item.course || 'Nimo Labs Program',
        track,
        color: item.color || palette.color,
        rgb: item.rgb || palette.rgb,
        rating: Number(item.rating) || 5,
      }
    })
}

export function removeTestimonialById(items = [], testimonialId) {
  return (items || []).filter((item) => item?.id !== testimonialId)
}

export function normalizePartners(items = []) {
  return (items || [])
    .filter((item) => item && (item.name || item.city || item.type))
    .map((item, index) => {
      const palette = partnerPalette[index % partnerPalette.length]
      return {
        id: item.id || `${item.name || 'partner'}-${index}`,
        name: item.name || 'Partner School',
        city: item.city || 'Bhopal',
        type: item.type || 'STEM Lab',
        color: item.color || palette.color,
        rgb: item.rgb || palette.rgb,
      }
    })
}

export function removePartnerById(items = [], partnerId) {
  return (items || []).filter((item) => item?.id !== partnerId)
}
