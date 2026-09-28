import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initContent } from './utils/contentStore'

const root = createRoot(document.getElementById('root'))

// Load all JSON content from the FastAPI backend once, before the first paint,
// so every section's synchronous content getters read populated data.
initContent().finally(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
