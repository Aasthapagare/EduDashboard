
import { createApiClient } from './api'

const api = createApiClient(
  import.meta.env.VITE_ASSIGNMENT_SERVICE_URL || '/api/assignment-service'
)

export async function getAssignments() {
  const response = await api.get('/assignments')
  return response.data
}

export async function createAssignment(assignment) {
  const response = await api.post('/assignments', assignment)
  return response.data
}

export async function updateAssignment(assignment) {
  const response = await api.put('/assignments', assignment)
  return response.data
}

export async function deleteAssignment(id) {
  const response = await api.delete(`/assignments/${id}`)
  return response.data
}
