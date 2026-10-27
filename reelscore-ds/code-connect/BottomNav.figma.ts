// url=https://www.figma.com/design/BqqlPHDFUv4YmT6NNYHoMh/Reelscore-Design-System?node-id=9-132
// source=dist/index.d.ts
// component=BottomNav
import figma from 'figma'
const instance = figma.selectedInstance

// Each BottomNavItem is one destination; its Icon swap reports the icon name through the Icon template.
const nav = instance.findLayers((n) => n.type === 'INSTANCE' && n.name === 'BottomNavItem')
const items = nav
  .map((item) => {
    const icon = item.getInstanceSwap('Icon')
    let iconName = ''
    if (icon && icon.type === 'INSTANCE') {
      iconName = icon.executeTemplate().metadata.props.name
    }
    const iconPart = iconName ? `, icon: "${iconName}"` : ''
    const activePart = item.getPropertyValue('Active') === 'True' ? ', active: true' : ''
    return `{ label: "${item.getPropertyValue('Label')}"${iconPart}, href: "#"${activePart} }`
  })
  .join(', ')

export default {
  example: figma.code`<BottomNav items={[${items}]} />`,
  imports: ['import { BottomNav } from "reelscore"'],
  id: 'bottom-nav',
  metadata: { nestable: false },
}
