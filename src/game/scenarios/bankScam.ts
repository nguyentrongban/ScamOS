import type { AppId, GameState, ScenarioEvent } from '../../types'
let uid = 0
const nid = () => String(++uid)
export const say = (s: GameState, thread: string, text: string, mine = false): GameState =>
  ({ ...s, msgs: [...s.msgs, { id: nid(), thread, text, at: s.minute, mine }] })
export const notify = (s: GameState, app: AppId, title: string, body: string): GameState =>
  ({ ...s, notices: [...s.notices, { id: nid(), app, title, body }] })

const BANK = 'NH-VCB'
const bankChoices = [
  { id: 'open_link', label: 'Mở liên kết' },
  { id: 'call_card', label: 'Gọi số in trên thẻ' },
  { id: 'ignore', label: 'Bỏ qua' },
]

export const events: ScenarioEvent[] = [
  { id: 'mom', at: 1, run: s => notify(say(s, 'Mẹ', 'Con ăn cơm chưa? Tối nay về sớm nhé.'), 'messages', 'Mẹ', 'Con ăn cơm chưa? Tối nay về sớm nhé.') },
  { id: 'bank1', at: 3, run: s => ({
    ...notify(say(s, BANK, 'Tài khoản của quý khách có dấu hiệu bất thường và sẽ bị khóa sau 30 phút. Xác thực ngay tại: vcb-xacthuc.top'), 'messages', BANK, 'Tài khoản của quý khách sẽ bị khóa sau 30 phút...'),
    choices: bankChoices }) },
  { id: 'mail', at: 6, run: s => notify(s, 'email', 'Email mới', 'Hóa đơn điện tháng 9') },
  { id: 'push', at: 12, when: s => !s.flags.link && !s.flags.called, run: s => ({
    ...notify(say(s, BANK, 'Còn 15 phút. Tài khoản sẽ bị khóa vĩnh viễn nếu quý khách không xác thực.'), 'messages', BANK, 'Còn 15 phút...'),
    choices: [bankChoices[0], bankChoices[2]] }) },
]

export const actions: Record<string, (s: GameState) => GameState> = {
  open_link: s => ({ ...s, flags: { ...s.flags, link: true } }),
  ignore: s => ({ ...say(s, BANK, 'Mình để đó xem sao.', true), flags: { ...s.flags, ignored: true } }),
  call_card: s => ({ ...say(s, 'Tổng đài (số in trên thẻ)', 'Tài khoản của quý khách đang hoạt động bình thường. Cảm ơn quý khách đã liên hệ.'), flags: { ...s.flags, called: true } }),
  submit_otp: s => {
    if (!s.flags.link || s.flags.lost) return s
    const amount = -48000000
    return notify({
      ...s, balance: s.balance + amount,
      txs: [{ id: nid(), label: 'Chuyển tiền liên ngân hàng', amount, at: s.minute }, ...s.txs],
      flags: { ...s.flags, lost: true },
    }, 'bank', 'Ngân hàng', 'Giao dịch -48.000.000đ vừa được thực hiện')
  },
}
