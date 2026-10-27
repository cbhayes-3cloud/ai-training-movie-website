// url=https://www.figma.com/design/BqqlPHDFUv4YmT6NNYHoMh/Reelscore-Design-System?node-id=1-138
// source=dist/index.d.ts
// component=Button
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')
const variant = instance.getEnum('Variant', { Primary: 'primary', Secondary: 'secondary', Ghost: 'ghost' })
const size = instance.getEnum('Size', { Small: 'sm', Medium: 'md', Large: 'lg' })
const state = instance.getEnum('State', { Default: 'default', Hover: 'hover', Disabled: 'disabled' })
const showIcon = instance.getBoolean('Show Icon')

// Icon is an INSTANCE_SWAP: each Icon component's own template reports its name.
const icon = showIcon ? instance.getInstanceSwap('Icon') : null
let iconName = ''
if (icon && icon.type === 'INSTANCE') {
  iconName = icon.executeTemplate().metadata.props.name
}
const iconAttr = iconName ? ` icon="${iconName}"` : ''
// Hover has no prop: it is the pointer state.
const disabledAttr = state === 'disabled' ? ' disabled' : ''

export default {
  example: figma.code`<Button variant="${variant}" size="${size}"${iconAttr}${disabledAttr}>${label}</Button>`,
  imports: ['import { Button } from "reelscore"'],
  id: 'button',
  metadata: { nestable: true },
}
