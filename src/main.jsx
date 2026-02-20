import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Chessboard from './components/Chessboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Chessboard />
  </StrictMode>,
)