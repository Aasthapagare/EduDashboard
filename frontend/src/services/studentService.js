import { createApiClient } from './api'

// Default goes through the Vite proxy (see vite.config.js) to the Student Service on port 8081.
// Override with VITE_STUDENT_API_URL (for example http://localhost:8081) to call it directly.
const client = createApiClient(import.meta.env.VITE_STUDENT_API_URL || '/api/student-service')

// Backend: StudentController, base path /students.
export async function getStudents() {
  const { data } = await client.get('/students') // GET /students -> Student[]
  return data
}

export async function createStudent({ name, email, mobile }) {
  const { data } = await client.post('/students', { name, email, mobile }) // POST /students -> 201
  return data
}

export async function updateStudent({ id, name, email, mobile }) {
  const { data } = await client.put('/students', { id, name, email, mobile }) // PUT /students -> 201
  return data
}

export async function deleteStudent(id) {
  await client.delete(`/students/${id}`) // DELETE /students/{id} -> 204
}
