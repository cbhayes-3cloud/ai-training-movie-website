// url=https://www.figma.com/design/BqqlPHDFUv4YmT6NNYHoMh/Reelscore-Design-System?node-id=12-150
// source=dist/index.d.ts
// component=CastStrip
import figma from 'figma'
const instance = figma.selectedInstance

// Photos, links and the shimmer are not drawn in Figma: pass `photo` and `href` per person from your data.
const items = instance.findLayers((n) => n.type === 'INSTANCE' && n.name === 'CastItem')
const people = items
  .map((p) => {
    const tone = p.getEnum('Tone', { Night: 'night', Red: 'red', Slate: 'slate', Gold: 'gold' })
    return `{ name: "${p.getPropertyValue('Name')}", role: "${p.getPropertyValue('Role')}", tone: "${tone}" }`
  })
  .join(', ')

// The leader frame only exists when the strip has a title.
const leader = instance.findLayers((n) => n.type === 'INSTANCE' && n.name === 'CastLeader')[0]
const titleAttr = leader ? ` title="${leader.getPropertyValue('Title')}"` : ''

export default {
  example: figma.code`<CastStrip${titleAttr} people={[${people}]} />`,
  imports: ['import { CastStrip } from "reelscore"'],
  id: 'cast-strip',
  metadata: { nestable: false },
}
