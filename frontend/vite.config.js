
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  const proxy = {
    '/api/course-service': {
      target:
        env.VITE_COURSE_SERVICE_URL || 'http://localhost:8082',
      changeOrigin: true,
      rewrite: (path) =>
        path.replace(/^\/api\/course-service/, ''),
    },

    '/api/student-service': {
      target:
        env.VITE_STUDENT_SERVICE_URL || 'http://localhost:8081',
      changeOrigin: true,
      rewrite: (path) =>
        path.replace(/^\/api\/student-service/, ''),
    },

    
'/api/instructor-service': {
  target:
    env.VITE_INSTRUCTOR_SERVICE_URL || 'http://localhost:8083',
  changeOrigin: true,
  rewrite: (path) =>
    path.replace(/^\/api\/instructor-service/, ''),
},

  }

  return {
    plugins: [react()],
    server: { proxy },
    preview: { proxy },
  }
})
