// url=https://www.figma.com/design/BqqlPHDFUv4YmT6NNYHoMh/Reelscore-Design-System?node-id=10-613
// source=dist/index.d.ts
// component=PosterRow
import figma from 'figma'
const instance = figma.selectedInstance

// Phone / Desktop is responsive in code; the arrows are hover-only, so neither has a prop.
const title = instance.getString('Title')

// Each MovieCard in the track renders through the MovieCard template. A template can only
// interpolate a fixed number of sections, so the first eight cards are shown.
const cards = instance.findConnectedInstances((n) => n.codeConnectId() === 'movie-card')
const card = (i: number) => (cards[i] ? cards[i].executeTemplate().example : '')

export default {
  example: figma.code`<PosterRow title="${title}">
  ${card(0)}
  ${card(1)}
  ${card(2)}
  ${card(3)}
  ${card(4)}
  ${card(5)}
  ${card(6)}
  ${card(7)}
</PosterRow>`,
  imports: ['import { PosterRow } from "reelscore"'],
  id: 'poster-row',
  metadata: { nestable: false },
}
