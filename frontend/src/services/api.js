import axios from 'axios'

// Creates an Axios client for one backend service.
export function createApiClient(baseURL) {
  return axios.create({
    baseURL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  })
}

// Converts an Axios error into a message that can be shown to the user.
// The backend returns empty error bodies, so messages are derived from the status code.
const UNREACHABLE =
  'Cannot reach the Student Service. Check that it is running on port 8081 and that the API base URL is configured correctly.'

export function getErrorMessage(error, fallback = 'The request failed.') {
  if (error?.code === 'ECONNABORTED') {
    return 'The request timed out. Check that the service is running and try again.'
  }
  if (error?.response) {
    const { status } = error.response
    // The Vite proxy answers 502/503/504 when the target service is not running.
    if (status === 502 || status === 503 || status === 504) return UNREACHABLE
    if (status === 404) return 'The requested record was not found.'
    if (status === 400) return 'The service rejected the data as invalid (HTTP 400).'
    if (status >= 500) return `The service reported a server error (HTTP ${status}).`
    return `${fallback} (HTTP ${status})`
  }
  return UNREACHABLE
}
