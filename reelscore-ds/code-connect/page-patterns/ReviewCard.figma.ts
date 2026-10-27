// url=https://www.figma.com/design/BqqlPHDFUv4YmT6NNYHoMh/Reelscore-Design-System?node-id=25-59
// source=../src/pages/TitlePage.tsx
// component=ReviewCard
import figma from 'figma'
const instance = figma.selectedInstance

// Desktop / Phone is responsive in code, so Size has no prop.
const author = instance.getString('Name')
const text = instance.getString('Review')
const showLink = instance.getBoolean('Show Link')

// The Figma date reads "Rated Jul 9, 2016" (or "Reviewed ..."); the code wants the ISO date.
const printed = instance.getString('Date').replace(/^(Rated|Reviewed)\s+/, '')
const parsed = new Date(printed + ' 12:00')
const date = isNaN(parsed.getTime()) ? printed : parsed.toISOString().slice(0, 10)

// The score lives in the nested RatingBadge; hidden when the reviewer gave none.
const showScore = instance.getBoolean('Show Score')
const badge = showScore ? instance.findInstance('score') : null
const ratingPart = badge && badge.type === 'INSTANCE' ? ` rating: ${parseFloat(badge.getString('Score'))},` : ''
// The review's source link is only shown when the text was shortened.
const urlPart = showLink ? ' url: "https://…",' : ''

export default {
  example: figma.code`<ReviewCard review={{ id: "…", author: "${author}", date: "${date}",${ratingPart} text: "${text}",${urlPart} }} />`,
  // ReviewCard is a local function in TitlePage.tsx: export it there before importing it elsewhere.
  imports: ['import { ReviewCard } from "../pages/TitlePage"'],
  id: 'review-card',
  metadata: { nestable: true },
}
