import { useEffect, useState } from 'react'
export function useWide() {
  const q = '(min-width: 768px)'
  const [w, setW] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q); const f = () => setW(m.matches)
    m.addEventListener('change', f); return () => m.removeEventListener('change', f)
  }, [])
  return w
}
