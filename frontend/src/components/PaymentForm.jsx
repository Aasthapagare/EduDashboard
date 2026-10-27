
import { useState } from 'react'

const initialValues = {
  studentId: '',
  enrollmentId: '',
  amount: '',
  status: 'Pending',
}

export default function PaymentForm({
  payment,
  submitting,
  onSubmit,
  onCancel,
}) {
  const isEdit = Boolean(payment)

  const [values, setValues] = useState(() =>
    payment
      ? {
          studentId: String(payment.studentId ?? ''),
          enrollmentId: String(payment.enrollmentId ?? ''),
          amount: String(payment.amount ?? ''),
          status: payment.status ?? 'Pending',
        }
      : initialValues
  )

  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (
      !/^\d+$/.test(values.studentId) ||
      Number(values.studentId) < 1 ||
      !/^\d+$/.test(values.enrollmentId) ||
      Number(values.enrollmentId) < 1
    ) {
      setError('Student ID aur Enrollment ID positive numbers hone chahiye.')
      return
    }

    if (
      !/^\d+$/.test(values.amount) ||
      Number(values.amount) < 0 ||
      !Number.isSafeInteger(Number(values.amount))
    ) {
      setError('Amount valid whole number hona chahiye.')
      return
    }

    if (!values.status.trim()) {
      setError('Payment status select karo.')
      return
    }

    onSubmit({
      studentId: Number(values.studentId),
      enrollmentId: Number(values.enrollmentId),
      amount: Number(values.amount),
      status: values.status.trim(),
    })
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2 className="card__title">
        {isEdit ? `Edit Payment #${payment.id}` : 'Add Payment'}
      </h2>

      <div className="form__fields">
        <div className="field">
          <label htmlFor="payment-student-id">Student ID</label>
          <input
            id="payment-student-id"
            name="studentId"
            type="number"
            min="1"
            step="1"
            value={values.studentId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="payment-enrollment-id">Enrollment ID</label>
          <input
            id="payment-enrollment-id"
            name="enrollmentId"
            type="number"
            min="1"
            step="1"
            value={values.enrollmentId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="payment-amount">Amount (₹)</label>
          <input
            id="payment-amount"
            name="amount"
            type="number"
            min="0"
            step="1"
            value={values.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="payment-status">Status</label>
          <select
            id="payment-status"
            name="status"
            value={values.status}
            onChange={handleChange}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {error && <p className="field__error" role="alert">{error}</p>}

      <div className="form__actions">
        <button
          type="submit"
          className="btn btn--primary"
          disabled={submitting}
        >
          {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Payment'}
        </button>

        {isEdit && (
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
