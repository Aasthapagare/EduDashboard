import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  // The Spring Boot services have no CORS configuration, so the dev and preview servers
  // forward /api/student-service/* to the Student Service (default port 8081).
  const proxy = {
    '/api/student-service': {
      target: env.VITE_STUDENT_SERVICE_URL || 'http://localhost:8081',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/student-service/, ''),
    },
  }
  return {
    plugins: [react()],
    server: { proxy },
    preview: { proxy },
  }
})
