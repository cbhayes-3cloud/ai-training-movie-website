// url=https://www.figma.com/design/BqqlPHDFUv4YmT6NNYHoMh/Reelscore-Design-System?node-id=25-74
// source=../src/pages/PersonPage.tsx
// component=CreditRow
import figma from 'figma'
const instance = figma.selectedInstance

// Desktop (year column) / Phone (year in the meta line) is responsive in code, so Size has no prop.
const title = instance.getString('Title')
// The Figma role reads "as Joe Mulwray" or "Self"; the code adds the "as" itself.
const role = instance.getString('Role').replace(/^as\s+/, '')
const roleAttr = role ? ` role: "${role}",` : ''

// Meta reads "Series · 4 episodes", with the year first on Phone and "Not out yet" for undated titles.
const episodes = /(\d+)\s+episodes?/.exec(instance.getString('Meta'))
const episodesAttr = episodes ? ` episodes: ${episodes[1]},` : ''

const showScore = instance.getBoolean('Show Score')
const score = showScore ? instance.findInstance('score') : null
const ratingPart = score && score.type === 'INSTANCE' ? `, rating: ${parseFloat(score.getString('Score'))}` : ''

export default {
  example: figma.code`<CreditRow department="Acting" credit={{ title: { id: "…", title: "${title}"${ratingPart} },${roleAttr}${episodesAttr} }} />`,
  // CreditRow is a local function in PersonPage.tsx: export it there before importing it elsewhere.
  imports: ['import { CreditRow } from "../pages/PersonPage"'],
  id: 'credit-row',
  metadata: { nestable: true },
}
