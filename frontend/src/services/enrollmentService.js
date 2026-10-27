
import { createApiClient } from './api'

const client = createApiClient(
  import.meta.env.VITE_ENROLLMENT_SERVICE_URL ||
    '/api/enrollment-service'
)

export async function getEnrollments() {
  const { data } = await client.get('/enrollments')
  return data
}

export async function createEnrollment({ studentId, courseId, status }) {
  const { data } = await client.post('/enrollments', null, {
    params: { studentId, courseId, status },
  })
  return data
}

export async function updateEnrollment(enrollment) {
  const { data } = await client.put('/enrollments', enrollment)
  return data
}

export async function deleteEnrollment(id) {
  await client.delete(`/enrollments/${id}`)
}

export function getEnrollmentErrorMessage(
  error,
  fallback = 'The Enrollment Service request failed.'
) {
  if (error?.code === 'ECONNABORTED') {
    return 'Request timed out. Check Enrollment Service on port 8084.'
  }

  if (error?.response) {
    const { status } = error.response

    if ([502, 503, 504].includes(status)) {
      return 'Cannot reach Enrollment Service. Check port 8084.'
    }

    if (status === 404) {
      return 'The enrollment or linked Student/Course record was not found.'
    }

    if (status === 400) {
      return 'The service rejected the submitted enrollment data.'
    }

    if (status >= 500) {
      return `Enrollment Service returned a server error (HTTP ${status}).`
    }

    return `${fallback} (HTTP ${status})`
  }

  return 'Cannot reach Enrollment Service. Check that port 8084 is running.'
}
