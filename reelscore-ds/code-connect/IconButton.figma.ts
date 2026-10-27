// url=https://www.figma.com/design/BqqlPHDFUv4YmT6NNYHoMh/Reelscore-Design-System?node-id=6-251
// source=dist/index.d.ts
// component=IconButton
import figma from 'figma'
const instance = figma.selectedInstance

const variant = instance.getEnum('Variant', { Ghost: 'ghost', Filled: 'filled', Outline: 'outline', Scrim: 'scrim' })
const size = instance.getEnum('Size', { Small: 'sm', Medium: 'md', Large: 'lg' })
// Pressed is the on state of a toggle; Default and Hover are not toggles.
const state = instance.getEnum('State', { Default: 'default', Hover: 'hover', Pressed: 'pressed' })
const badge = instance.getBoolean('Badge')

const icon = instance.getInstanceSwap('Icon')
let iconName = ''
if (icon && icon.type === 'INSTANCE') {
  iconName = icon.executeTemplate().metadata.props.name
}
// `label` is required in code but Figma has no text for it: start from the icon name.
const label = iconName ? iconName.charAt(0).toUpperCase() + iconName.slice(1) : 'Label'

const pressedAttr = state === 'pressed' ? ' pressed' : ''
const badgeAttr = badge ? ' badge' : ''

export default {
  example: figma.code`<IconButton icon="${iconName}" label="${label}" variant="${variant}" size="${size}"${pressedAttr}${badgeAttr} />`,
  imports: ['import { IconButton } from "reelscore"'],
  id: 'icon-button',
  metadata: { nestable: true },
}
