import { lazy, type ComponentType, type LazyExoticComponent, type ElementType } from 'react'
import { MessageSquare, Mail, Globe, Landmark, Phone, Folder, Settings } from 'lucide-react'
import type { AppId } from '../types'
interface Def { label: string; Icon: ElementType; C: LazyExoticComponent<ComponentType> }
export const registry: Record<AppId, Def> = {
  messages: { label: 'Tin nhắn', Icon: MessageSquare, C: lazy(() => import('../apps/messages/Messages')) },
  email: { label: 'Email', Icon: Mail, C: lazy(() => import('../apps/email/Email')) },
  browser: { label: 'Trình duyệt', Icon: Globe, C: lazy(() => import('../apps/browser/Browser')) },
  bank: { label: 'Ngân hàng', Icon: Landmark, C: lazy(() => import('../apps/banking/Bank')) },
  phone: { label: 'Điện thoại', Icon: Phone, C: lazy(() => import('../apps/phone/PhoneApp')) },
  files: { label: 'Tệp', Icon: Folder, C: lazy(() => import('../apps/files/Files')) },
  settings: { label: 'Cài đặt', Icon: Settings, C: lazy(() => import('../apps/files/SettingsApp')) },
}
export const appIds = Object.keys(registry) as AppId[]
