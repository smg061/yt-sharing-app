import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/** @type {import('vite').UserConfig} */
export default ({ mode }) => {
  console.log(process.cwd())
  return defineConfig({
    envDir: process.cwd(),
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    }
  })
}
// export default defineConfig({
//   plugins: [react()]  
// })
