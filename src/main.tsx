import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './index.css'
import App from './App.tsx'

// Clear any corrupted localStorage on startup if needed
try {
  const state = localStorage.getItem('todoAppState');
  if (state) {
    JSON.parse(state); // Test if it's valid JSON
  }
} catch (err) {
  console.warn('Clearing corrupted localStorage');
  localStorage.removeItem('todoAppState');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
