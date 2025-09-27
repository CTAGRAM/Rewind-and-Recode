import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx, ManifestV3Export } from '@crxjs/vite-plugin';
import manifestJson from './extension/manifest.json' assert { type: 'json' };

const manifest: ManifestV3Export = manifestJson as ManifestV3Export;

export default defineConfig(({ mode }) => {
  if (mode === 'extension') {
    return {
      plugins: [
        react(),
        crx({ manifest })
      ],
      build: {
        target: 'esnext',
        outDir: 'dist/chrome-mv3'
      }
    };
  }
  return {
    plugins: [react()],
    build: {
      outDir: 'dist'
    }
  };
});
