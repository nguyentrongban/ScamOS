import { Navigate, Route, Routes } from 'react-router-dom'
import Desktop from '../pages/Desktop'
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Desktop />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
