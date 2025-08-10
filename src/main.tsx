import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Terminal from './Terminal.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Terminal />
  </StrictMode>,
)
