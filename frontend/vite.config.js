import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: '192.168.4.24',
  //   port: 5173,
  // },
  // server: {
  //   host: '192.168.1.191',
  //   port: 5173,
  // }
});
