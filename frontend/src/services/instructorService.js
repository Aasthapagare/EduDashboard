
import { createApiClient } from './api'

const client = createApiClient(
  import.meta.env.VITE_INSTRUCTOR_SERVICE_URL ||
    '/api/instructor-service'
)

export async function getInstructors() {
  const { data } = await client.get('/instructors')
  return data
}

export async function createInstructor({ name, email, specialization }) {
  const { data } = await client.post('/instructors', {
    name,
    email,
    specialization,
  })
  return data
}

export async function updateInstructor({
  id,
  name,
  email,
  specialization,
}) {
  const { data } = await client.put('/instructors', {
    id,
    name,
    email,
    specialization,
  })
  return data
}

export async function deleteInstructor(id) {
  await client.delete(`/instructors/${id}`)
}

export function getInstructorErrorMessage(
  error,
  fallback = 'The Instructor Service request failed.'
) {
  if (error?.code === 'ECONNABORTED') {
    return 'Request timed out. Check Instructor Service on port 8083.'
  }

  if (error?.response) {
    const { status } = error.response

    if ([502, 503, 504].includes(status)) {
      return 'Cannot reach Instructor Service. Check port 8083.'
    }

    if (status === 404) return 'The requested instructor was not found.'
    if (status === 400) return 'The service rejected the submitted data.'
    if (status >= 500) {
      return `Instructor Service returned a server error (HTTP ${status}).`
    }

    return `${fallback} (HTTP ${status})`
  }

  return 'Cannot reach Instructor Service. Check that port 8083 is running.'
}
