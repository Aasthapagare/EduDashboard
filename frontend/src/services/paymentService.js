
import { createApiClient } from './api'

const api = createApiClient(
  import.meta.env.VITE_PAYMENT_SERVICE_URL || '/api/payment-service'
)

export async function getPayments() {
  const response = await api.get('/payments')
  return response.data
}

export async function createPayment({ studentId, enrollmentId, amount, status }) {
  const response = await api.post('/payments', null, {
    params: {
      studentId: Number(studentId),
      enrollmentId: Number(enrollmentId),
      ammount: Number(amount), // Backend parameter ki exact spelling
      status,
    },
  })
  return response.data
}

export async function updatePayment(payment) {
  const response = await api.put('/payments', payment)
  return response.data
}

export async function deletePayment(id) {
  const response = await api.delete(`/payments/${id}`)
  return response.data
}
