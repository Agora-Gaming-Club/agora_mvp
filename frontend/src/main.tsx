import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { CustomFlowbiteTheme } from 'flowbite-react';

const customTheme: CustomFlowbiteTheme = {
  button: {
    color: {
      primary: 'bg-red-500 hover:bg-red-600',
    },
  },
};
alert('hellow');

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
