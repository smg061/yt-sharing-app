import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/** @type {import('vite').UserConfig} */
export default ({ mode }) => {
  console.log(process.cwd())
  return defineConfig({
    envDir: process.cwd(),
    plugins: [react()],
  })
}
// export default defineConfig({
//   plugins: [react()]  
// })
