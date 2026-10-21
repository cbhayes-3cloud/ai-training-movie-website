// url=https://www.figma.com/design/BqqlPHDFUv4YmT6NNYHoMh/Reelscore-Design-System?node-id=6-253
// source=dist/index.d.ts
// component=AgeBadge
import figma from 'figma'
const instance = figma.selectedInstance

const rating = instance.getString('Rating')

export default {
  example: figma.code`<AgeBadge rating="${rating}" />`,
  imports: ['import { AgeBadge } from "reelscore"'],
  id: 'age-badge',
  metadata: { nestable: true },
}
