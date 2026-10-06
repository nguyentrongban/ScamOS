export default function ListApp({ rows }: { rows: { title: string; sub: string }[] }) {
  return (
    <ul className="divide-y divide-white/10">
      {rows.map(r => (
        <li key={r.title} className="p-4"><p className="text-sm font-medium">{r.title}</p><p className="text-xs opacity-60">{r.sub}</p></li>
      ))}
    </ul>
  )
}
