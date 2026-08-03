import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === 'serve' // true para `npm run dev`, false para `npm run build`

  return {
    plugins: [vue(), vueDevTools(), tailwindcss()],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    /* base: isDev ? '/' : '/work/models/PTP/NPTP/PTP_Doc_Ciudadanos/Precriterios_2027/', */

    base: isDev ? '/' : '/work/models/PTP/NPTP/PTP_Doc_Ciudadanos/Precriterios_2027/',
    server: {
      host: 'localhost', // expone a la red
      watch: {
        usePolling: true, // para entornos como WSL/Docker
      },
      hmr: {
        host: 'localhost',
      },
    },

    build: {
      emptyOutDir: true, // elimina los archivos del directorio de salida antes de compilar
    },
  }
})
