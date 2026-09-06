import reactPlugin from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode } ) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [reactPlugin()],
    root: import.meta.dirname,
    define: {
      'process.env': env
    },
    test: {
      name: 'IPPT',
      clearMocks: true,
      include: [
        'src/**/__tests__/*.test.ts',
        'src/**/__tests__/*.test.tsx',
      ],
      silent: 'passed-only',
      watch: false,
    }
  };
});
