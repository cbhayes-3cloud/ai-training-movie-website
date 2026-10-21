// url=https://www.figma.com/design/BqqlPHDFUv4YmT6NNYHoMh/Reelscore-Design-System?node-id=8-141
// source=dist/index.d.ts
// component=Tabs
import figma from 'figma'
const instance = figma.selectedInstance

// Phone / Desktop is responsive in code, so Size has no prop.
const overlay = instance.getEnum('Overlay', { True: true, False: false })

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const tabs = instance.findLayers((n) => n.type === 'INSTANCE' && n.name === 'Tab')
const items = tabs
  .map((t) => `{ id: "${slug(t.getPropertyValue('Label') as string)}", label: "${t.getPropertyValue('Label')}" }`)
  .join(', ')
const active = tabs.filter((t) => t.getPropertyValue('Active') === 'True')[0]
const activeAttr = active ? ` defaultValue="${slug(active.getPropertyValue('Label') as string)}"` : ''
const overlayAttr = overlay ? ' overlay' : ''

export default {
  example: figma.code`<Tabs items={[${items}]}${activeAttr}${overlayAttr} />`,
  imports: ['import { Tabs } from "reelscore"'],
  id: 'tabs',
  metadata: { nestable: true },
}
