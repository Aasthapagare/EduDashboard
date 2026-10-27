import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  const services = {
    student: {
      prefix: '/api/student-service',
      target: env.VITE_STUDENT_SERVICE_URL || 'http://localhost:8081',
    },
    course: {
      prefix: '/api/course-service',
      target: env.VITE_COURSE_SERVICE_URL || 'http://localhost:8082',
    },
    instructor: {
      prefix: '/api/instructor-service',
      target: env.VITE_INSTRUCTOR_SERVICE_URL || 'http://localhost:8083',
    },
    enrollment: {
      prefix: '/api/enrollment-service',
      target: env.VITE_ENROLLMENT_SERVICE_URL || 'http://localhost:8084',
    },
    payment: {
      prefix: '/api/payment-service',
      target: env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8085',
    },
  }

  const proxy = Object.values(services).reduce((config, service) => {
    config[service.prefix] = {
      target: service.target,
      changeOrigin: true,
      rewrite: (path) => path.replace(service.prefix, ''),
    }
    return config
  }, {})

  return {
    plugins: [react()],
    server: { proxy },
    preview: { proxy },
  }
})
