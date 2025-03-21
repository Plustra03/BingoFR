import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.css'
import './styles/tailwind.css'

import Game from './views/Game'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Game />
    </StrictMode>,
)
