// url=https://www.figma.com/design/BqqlPHDFUv4YmT6NNYHoMh/Reelscore-Design-System?node-id=9-601
// source=dist/index.d.ts
// component=RatingInput
import figma from 'figma'
const instance = figma.selectedInstance

// Value is whole points out of 10 (7 = three and a half stars); 0 is the unrated state.
const value = instance.getEnum('Value', {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
})
const valueAttr = value > 0 ? ` defaultValue={${value}}` : ''

export default {
  example: figma.code`<RatingInput${valueAttr} />`,
  imports: ['import { RatingInput } from "reelscore"'],
  id: 'rating-input',
  metadata: { nestable: true },
}
