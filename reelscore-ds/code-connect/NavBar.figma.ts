// url=https://www.figma.com/design/BqqlPHDFUv4YmT6NNYHoMh/Reelscore-Design-System?node-id=9-96
// source=dist/index.d.ts
// component=NavBar
import figma from 'figma'
const instance = figma.selectedInstance

// Desktop / Mobile is responsive in code (links hide under 768px), so Size has no prop.
// The open search field and results panel are not drawn in Figma.
const navLinks = instance.findLayers((n) => n.type === 'INSTANCE' && n.name === 'NavLink')
const links = navLinks
  .map(
    (l) =>
      `{ label: "${l.getPropertyValue('Label')}", href: "#"${l.getPropertyValue('Active') === 'True' ? ', active: true' : ''} }`,
  )
  .join(', ')
const linksAttr = links ? ` links={[${links}]}` : ''

const avatar = instance.findLayers((n) => n.type === 'INSTANCE' && n.name === 'Avatar')[0]
const initialsAttr = avatar ? ` initials="${avatar.getPropertyValue('Initials')}"` : ''

export default {
  example: figma.code`<NavBar${linksAttr}${initialsAttr} />`,
  imports: ['import { NavBar } from "reelscore"'],
  id: 'nav-bar',
  metadata: { nestable: false },
}
