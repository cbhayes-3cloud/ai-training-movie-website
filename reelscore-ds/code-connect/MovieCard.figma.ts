// url=https://www.figma.com/design/BqqlPHDFUv4YmT6NNYHoMh/Reelscore-Design-System?node-id=9-1469
// source=dist/index.d.ts
// component=MovieCard
import figma from 'figma'
const instance = figma.selectedInstance

// Small / Large is the breakpoint width (poster-width-sm / poster-width-lg), so Size has no prop.
const tone = instance.getEnum('Tone', { Night: 'night', Red: 'red', Gold: 'gold', Slate: 'slate' })
const liked = instance.getEnum('Liked', { True: true, False: false })
const watched = instance.getEnum('Watched', { True: true, False: false })
const title = instance.getString('Title')

// Meta is "2024 · Film": year first, then kind.
const parts = instance.getString('Meta').split('·').map((p) => p.trim())
const yearAttr = parts[0] ? ` year="${parts[0]}"` : ''
const kindAttr = parts[1] ? ` kind="${parts[1]}"` : ''

// The score lives in the nested RatingBadge's text layer.
const score = instance.findText('value', { traverseInstances: true })
const ratingAttr = score && score.type === 'TEXT' ? ` rating={${parseFloat(score.textContent)}}` : ''

export default {
  example: figma.code`<MovieCard title="${title}"${yearAttr}${kindAttr}${ratingAttr} tone="${tone}" liked={${liked}} watched={${watched}} />`,
  imports: ['import { MovieCard } from "reelscore"'],
  id: 'movie-card',
  metadata: { nestable: true },
}
