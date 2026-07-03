import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css"
import './index.css';
import GameApp from './components/GameApp.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GameApp />
  </StrictMode>,
)
