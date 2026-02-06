import { createRoot } from 'react-dom/client'
import { ReduxProvider, ToastProvider, DialogPortalProvider } from './providers'
import AppRouter from './AppRouter';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

createRoot(document.getElementById('root')!).render(
  <ReduxProvider>
    <DialogPortalProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </DialogPortalProvider>
  </ReduxProvider>,
)
