import path from 'node:path';
import { defineConfig } from 'tsup';

const src = path.resolve(__dirname, 'src');

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    worker: 'src/worker.ts',
  },
  format: ['esm'],
  target: 'es2022',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: true,
  tsconfig: './tsconfig.json',
  external: ['@buildautomaton/runtime', '@buildautomaton/ui-runtime', 'marked', 'react', 'react-dom', 'lucide-react'],
  esbuildOptions(options) {
    options.alias = {
      '@plugins': src,
    };
  },
});
