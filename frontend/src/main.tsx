import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

document.addEventListener('DOMContentLoaded', () => {
  createInertiaApp({
    resolve: (name) => {
      const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
      return pages[`./Pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
      createRoot(el).render(<App {...props} />);
    },
  }).then(() => {});
});
