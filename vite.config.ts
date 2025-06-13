import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Configuration pour GitHub Actions + GitHub Pages
  // La base sera automatiquement détectée par le workflow
  base: mode === 'production' ? '/template-brasserie/' : '/',
  
  server: {
    host: "::",
    port: 8080,
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: mode === 'development', // Sourcemap uniquement en dev
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return `assets/[name]-[hash][extname]`;

          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      }
    },
    minify: 'esbuild',
    target: 'esnext',
    // Optimisations pour GitHub Pages
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 500,
  },
  
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  
  // Configuration pour éviter les problèmes de CORS en dev
  preview: {
    port: 4173,
    host: true,
  },
}));