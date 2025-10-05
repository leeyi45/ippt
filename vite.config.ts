import reactPlugin from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode } ) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [reactPlugin()],
    root: import.meta.dirname,
    define: {
      'process.env': env
    }
  };
});
