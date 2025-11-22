import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'recharts',
      'chart.js',
      'react-chartjs-2',
      'framer-motion',
    ],
    force: true, // ép Vite tái tối ưu lại các dependency khi cần
  },
  server: {
    port: 5173, // hoặc đổi cổng nếu bị xung đột
    open: true, // tự động mở trình duyệt
  },
})
