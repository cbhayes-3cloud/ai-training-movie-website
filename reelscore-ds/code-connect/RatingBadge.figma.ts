// url=https://www.figma.com/design/BqqlPHDFUv4YmT6NNYHoMh/Reelscore-Design-System?node-id=6-276
// source=dist/index.d.ts
// component=RatingBadge
import figma from 'figma'
const instance = figma.selectedInstance

const tone = instance.getEnum('Tone', { Gold: 'gold', Brand: 'brand' })
const size = instance.getEnum('Size', { Small: 'sm', Medium: 'md' })
const showVotes = instance.getBoolean('Show Votes')
const value = parseFloat(instance.getString('Score'))
// The Figma text includes the parentheses ("(12.4k)"); the code adds its own.
const votes = instance.getString('Votes').replace(/[()]/g, '')
const votesAttr = showVotes ? ` votes="${votes}"` : ''

export default {
  example: figma.code`<RatingBadge value={${value}} tone="${tone}" size="${size}"${votesAttr} />`,
  imports: ['import { RatingBadge } from "reelscore"'],
  id: 'rating-badge',
  metadata: { nestable: true },
}
