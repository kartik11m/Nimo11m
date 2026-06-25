import test from 'node:test'
import assert from 'node:assert/strict'

import { getPreviewItems } from './previewData.js'

test('getPreviewItems keeps the newest mapped entries and filters empty values', () => {
  const items = getPreviewItems(
    [
      { data: { title: 'One', subtitle: 'A' } },
      { data: { title: 'Two', subtitle: 'B' } },
      { data: { title: 'Three', subtitle: 'C' } },
    ],
    (entry) => entry?.title ? { title: entry.title, subtitle: entry.subtitle } : null,
    2
  )

  assert.deepEqual(items, [
    { title: 'One', subtitle: 'A' },
    { title: 'Two', subtitle: 'B' },
  ])
})
