import ListApp from '../../components/ListApp'
export default function Files() {
  return <ListApp rows={[
    { title: 'Ảnh', sub: '124 tệp' },
    { title: 'Tài liệu', sub: '18 tệp' },
    { title: 'Tải xuống', sub: '3 tệp' },
  ]} />
}
