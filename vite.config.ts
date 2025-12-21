import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const defaultOrigin = 'https://larek-api.nomoreparties.co';
  const apiOrigin = env.VITE_API_PROXY_TARGET ?? env.VITE_API_ORIGIN ?? defaultOrigin;
  const apiBasePath = env.VITE_API_BASE_PATH ?? '/api/weblarek';

  return {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [
            './src/scss',
          ],
        },
      },
    },
    server: {
      proxy: {
        [apiBasePath]: {
          target: apiOrigin,
          changeOrigin: true,
          secure: true,
        },
        '/content/weblarek': {
          target: apiOrigin,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
