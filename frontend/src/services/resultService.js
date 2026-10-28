
import { createApiClient } from './api'

const api = createApiClient(
  import.meta.env.VITE_RESULT_SERVICE_URL || '/api/result-service'
)

export async function getResults() {
  const response = await api.get('/results')
  return response.data
}

export async function createResult(result) {
  const response = await api.post('/results', result)
  return response.data
}

export async function updateResult(result) {
  const response = await api.put('/results', result)
  return response.data
}

export async function deleteResult(id) {
  const response = await api.delete(`/results/${id}`)
  return response.data
}
