import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['**/*.{test,spec}.{js,jsx}'],
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/setupTests.js',
  },
});
