
import { createApiClient } from './api'

const client = createApiClient(
  import.meta.env.VITE_COURSE_SERVICE_URL || '/api/course-service'
)

export async function getCourses() {
  const { data } = await client.get('/courses')
  return data
}

export async function createCourse({ coursename, duration, fee }) {
  const { data } = await client.post('/courses', {
    coursename,
    duration,
    fee,
  })
  return data
}

export async function updateCourse({ id, coursename, duration, fee }) {
  const { data } = await client.put('/courses', {
    id,
    coursename,
    duration,
    fee,
  })
  return data
}

export async function deleteCourse(id) {
  await client.delete(`/courses/${id}`)
}

export function getCourseErrorMessage(
  error,
  fallback = 'The Course Service request failed.'
) {
  if (error?.code === 'ECONNABORTED') {
    return 'Request timed out. Check Course Service on port 8082.'
  }

  if (error?.response) {
    const { status } = error.response

    if ([502, 503, 504].includes(status)) {
      return 'Cannot reach Course Service. Check that port 8082 is running.'
    }

    if (status === 404) return 'The requested course was not found.'
    if (status === 400) return 'The Course Service rejected the submitted data.'
    if (status >= 500) {
      return `Course Service returned a server error (HTTP ${status}).`
    }

    return `${fallback} (HTTP ${status})`
  }

  return 'Cannot reach Course Service. Check that port 8082 is running.'
}
