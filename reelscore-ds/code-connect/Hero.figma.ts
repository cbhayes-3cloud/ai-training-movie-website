// url=https://www.figma.com/design/BqqlPHDFUv4YmT6NNYHoMh/Reelscore-Design-System?node-id=13-268
// source=dist/index.d.ts
// component=Hero
import figma from 'figma'
const instance = figma.selectedInstance

// Phone / Desktop is responsive in code, so Size has no prop. The art is a placeholder in Figma:
// pass `image` (and `focalPoint`) from your data.
const title = instance.getString('Title')
const synopsis = instance.getString('Synopsis')
const year = instance.getString('Year')
const length = instance.getString('Length')
const showAdd = instance.getEnum('AddToList', { True: true, False: false })
const showTabs = instance.getBoolean('Show Tabs')

const age = instance.findInstance('age')
const ageAttr = age && age.type === 'INSTANCE' ? ` ageRating="${age.getString('Rating')}"` : ''

const score = instance.findInstance('score')
const ratingAttr = score && score.type === 'INSTANCE' ? ` rating={${parseFloat(score.getString('Score'))}}` : ''

const watch = instance.findInstance('watch')
const watchAttr = watch && watch.type === 'INSTANCE' ? ` watchLabel="${watch.getString('Label')}"` : ''

const add = instance.findInstance('add-to-list')
const addAttr = showAdd
  ? ` showAddToList${add && add.type === 'INSTANCE' ? ` addLabel="${add.getString('Label')}"` : ''}`
  : ''

// The band along the bottom is a Tabs instance, passed as children.
const tabs = showTabs ? instance.findInstance('tabs') : null
let tabsCode: any = ''
if (tabs && tabs.type === 'INSTANCE') {
  tabsCode = tabs.executeTemplate().example
}

export default {
  example: figma.code`<Hero
  title="${title}"${ageAttr}${ratingAttr}
  year="${year}"
  length="${length}"
  synopsis="${synopsis}"${watchAttr}${addAttr}
>
  ${tabsCode}
</Hero>`,
  imports: ['import { Hero } from "reelscore"'],
  id: 'hero',
  metadata: { nestable: false },
}
