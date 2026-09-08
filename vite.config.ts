import reactPlugin from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig(({ mode } ) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [reactPlugin()],
    root: import.meta.dirname,
    define: {
      'process.env': env
    },
    test: {
      projects: [
        {
          test: {
            name: 'Other Tests',
            include: ['src/**/__tests__/**/*.test.ts'],
          },
        },
        {
          test: {
            name: 'Browser Tests',
            include: [
              'src/**/__tests__/**/*.test.tsx',
            ],
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: [{ browser: 'chromium' }],
              screenshotFailures: false
            }
          }
        }
      ],
      silent: 'passed-only',
      watch: false,
    }
  };
});
