import test from 'node:test'
import assert from 'node:assert/strict'

import { normalizeFaqItems, normalizeTestimonials, removeTestimonialById, normalizePartners, removePartnerById, normalizeFaqContent, buildFaqCategoryKey, normalizeFaqCategories } from './sectionContent.js'

test('normalizeFaqItems keeps valid FAQ rows and defaults missing values', () => {
  const items = normalizeFaqItems([
    { cat: 'training', q: 'Question', a: 'Answer' },
    { cat: 'general', q: '', a: 'Another' },
  ])

  assert.deepEqual(items, [
    { id: 'training-0', cat: 'training', q: 'Question', a: 'Answer', color: '#FF6B35', rgb: '255,107,53' },
    { id: 'general-1', cat: 'general', q: 'Untitled question', a: 'Another', color: '#FF006E', rgb: '255,0,110' },
  ])
})

test('normalizeTestimonials fills missing fields and assigns a default palette', () => {
  const items = normalizeTestimonials([
    { name: 'Asha', quote: 'Great', course: 'Arduino' },
    { name: 'Ravi', quote: 'Nice', course: 'ROS', rating: 4 },
  ])

  assert.equal(items[0].rating, 5)
  assert.equal(items[0].track, 'Hardware')
  assert.equal(items[0].color, '#FF6B35')
  assert.equal(items[1].rating, 4)
  assert.equal(items[1].track, 'Robotics')
})

test('removeTestimonialById removes the matching testimonial', () => {
  const items = [
    { id: 'one', name: 'Asha' },
    { id: 'two', name: 'Ravi' },
  ]

  assert.deepEqual(removeTestimonialById(items, 'two'), [{ id: 'one', name: 'Asha' }])
})

test('normalizePartners fills missing fields and removePartnerById removes the matching partner', () => {
  const items = normalizePartners([
    { name: 'Nimo School', city: 'Bhopal', type: 'Robotics Lab' },
    { name: 'Test School', city: '', type: '' },
  ])

  assert.equal(items[0].color, '#FF6B35')
  assert.equal(items[1].city, 'Bhopal')
  assert.equal(items[1].type, 'STEM Lab')
  assert.deepEqual(removePartnerById(items, items[1].id), [items[0]])
})

test('normalizeFaqContent keeps categories and items from persisted FAQ payloads', () => {
  const result = normalizeFaqContent(
    { categories: [{ key: 'custom', label: 'Custom' }], items: [{ cat: 'custom', q: 'Question', a: 'Answer' }] },
    [{ key: 'training', label: 'Training' }],
  )

  assert.equal(result.categories[0].label, 'Custom')
  assert.equal(result.items[0].q, 'Question')
})

test('buildFaqCategoryKey generates a unique slug from the section title', () => {
  const key = buildFaqCategoryKey('AI & Robotics', [{ key: 'ai-robotics' }])
  assert.equal(key, 'ai-robotics-2')
})

test('normalizeFaqCategories assigns theme colors in sequence', () => {
  const categories = normalizeFaqCategories([{ key: 'one', label: 'One' }, { key: 'two', label: 'Two' }])

  assert.equal(categories[0].color, '#FF6B35')
  assert.equal(categories[1].color, '#00F5FF')
})
