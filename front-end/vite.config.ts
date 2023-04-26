import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/** @type {import('vite').UserConfig} */
export default ({ mode }) => {
  return defineConfig({
    envDir: process.cwd(),
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@lib": path.resolve(__dirname, "./src/lib"),
        "@routes": path.resolve(__dirname, "./src/routes"),
      },
    }
  })
}
// export default defineConfig({
//   plugins: [react()]  
// })
