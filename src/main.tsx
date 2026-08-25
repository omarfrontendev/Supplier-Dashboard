import { createRoot } from 'react-dom/client'
import { AppProviders } from './app/AppProviders'
import App from './App.tsx'
import './styles/global.css'
import "./app/i18n";
import { Toaster } from './components/ui/sonner.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <AppProviders>
      <App />
    </AppProviders>
    <Toaster />
  </>
);