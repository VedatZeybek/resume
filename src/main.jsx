import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import styles in correct order
import './styles/variables.css'
import './styles/reset.css'
import './styles/common.css'
import './styles/navbar.css'
import './styles/hero.css'
import './styles/about.css'
import './styles/projects.css'
import './styles/contact.css'
import './styles/footer.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
