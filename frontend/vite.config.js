import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://edubits0.vercel.app',
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('origin', 'https://edubits0.vercel.app');
            proxyReq.setHeader('referer', 'https://edubits0.vercel.app/');
          });
          proxy.on('proxyRes', (proxyRes) => {
            const setCookie = proxyRes.headers['set-cookie'];
            if (setCookie && Array.isArray(setCookie)) {
              proxyRes.headers['set-cookie'] = setCookie.map((cookie) =>
                cookie
                  .replace(/;\s*Secure/gi, '')
                  .replace(/;\s*SameSite=None/gi, '; SameSite=Lax')
                  .replace(/;\s*Domain=[^;]+/gi, '')
              );
            }
          });
        },
      },
    },
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          if (id.includes("html2pdf") || id.includes("html2canvas") || id.includes("jspdf")) {
            return "pdf-vendor";
          }

          if (id.includes("lucide-react") || id.includes("react-icons")) {
            return "icons-vendor";
          }

          if (/node_modules\/(react|react-dom|react-router-dom)\//.test(id)) {
            return "react-vendor";
          }

          if (id.includes("@vercel")) {
            return "vercel-vendor";
          }

          return undefined;
        },
      },
    },
  },
})
