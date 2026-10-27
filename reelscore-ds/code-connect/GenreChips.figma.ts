// url=https://www.figma.com/design/BqqlPHDFUv4YmT6NNYHoMh/Reelscore-Design-System?node-id=6-295
// source=dist/index.d.ts
// component=GenreChips
import figma from 'figma'
const instance = figma.selectedInstance

// Each Chip instance in the row is one genre; Selected=True means it starts selected.
const chips = instance.findLayers((n) => n.type === 'INSTANCE' && n.name === 'Chip')
const genres = chips.map((c) => `"${c.getPropertyValue('Label')}"`).join(', ')
const selected = chips
  .filter((c) => c.getPropertyValue('Selected') === 'True')
  .map((c) => `"${c.getPropertyValue('Label')}"`)
  .join(', ')
const selectedAttr = selected ? ` defaultSelected={[${selected}]}` : ''

export default {
  example: figma.code`<GenreChips genres={[${genres}]}${selectedAttr} />`,
  imports: ['import { GenreChips } from "reelscore"'],
  id: 'genre-chips',
  metadata: { nestable: false },
}
