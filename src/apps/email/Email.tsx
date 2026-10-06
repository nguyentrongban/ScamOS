import ListApp from '../../components/ListApp'
export default function Email() {
  return <ListApp rows={[
    { title: 'Hóa đơn điện tháng 9', sub: 'Điện lực · Tiền điện kỳ này: 412.000đ' },
    { title: 'Lịch họp lớp cuối tuần', sub: 'Lớp trưởng · Thứ Bảy 18:00 tại quán quen' },
  ]} />
}
