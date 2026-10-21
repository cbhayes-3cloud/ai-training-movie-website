// url=https://www.figma.com/design/BqqlPHDFUv4YmT6NNYHoMh/Reelscore-Design-System?node-id=11-69
// source=dist/index.d.ts
// component=Footer
import figma from 'figma'
const instance = figma.selectedInstance

// The TMDB notice and the "Movie reel design by Jake." credit are built in and must not be reworded,
// so they have no props. Phone / Desktop is responsive in code.
const linkLayers = instance.findLayers((n) => n.type === 'TEXT' && n.name === 'label')
const links = linkLayers.map((l) => `{ label: "${l.textContent}", href: "#" }`).join(', ')
const linksAttr = links ? ` links={[${links}]}` : ''

const copyright = instance.findText('copyright')
const copyrightAttr = copyright && copyright.type === 'TEXT' ? ` copyright="${copyright.textContent}"` : ''

export default {
  example: figma.code`<Footer${linksAttr}${copyrightAttr} />`,
  imports: ['import { Footer } from "reelscore"'],
  id: 'footer',
  metadata: { nestable: false },
}
