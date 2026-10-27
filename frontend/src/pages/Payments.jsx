
import { useCallback, useEffect, useState } from 'react'
import Alert from '../components/Alert'
import ConfirmDialog from '../components/ConfirmDialog'
import PaymentForm from '../components/PaymentForm'
import PaymentTable from '../components/PaymentTable'
import { getErrorMessage } from '../services/api'
import {
  createPayment,
  deletePayment,
  getPayments,
  updatePayment,
} from '../services/paymentService'
import '../styles/students.css'

async function fetchPayments() {
  try {
    const data = await getPayments()
    if (!Array.isArray(data)) {
      return { error: 'Payment Service returned an unexpected response.' }
    }
    return { data }
  } catch (error) {
    return { error: getErrorMessage(error, 'Unable to load payments.') }
  }
}

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formVersion, setFormVersion] = useState(0)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [searchId, setSearchId] = useState('')

  const loadPayments = useCallback(async () => {
    const result = await fetchPayments()
    if (result.error) {
      setLoadError(result.error)
    } else {
      setPayments(result.data)
      setLoadError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    let active = true
    fetchPayments().then((result) => {
      if (!active) return
      if (result.error) setLoadError(result.error)
      else {
        setPayments(result.data)
        setLoadError(null)
      }
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const handleRefresh = () => {
    setLoading(true)
    loadPayments()
  }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setNotice(null)

    try {
      if (editing) {
        await updatePayment({ id: editing.id, ...values })
        setNotice({
          type: 'success',
          message: `Payment #${editing.id} was updated.`,
        })
        setEditing(null)
      } else {
        const created = await createPayment(values)
        setNotice({
          type: 'success',
          message: `Payment was added with ID ${created.id}.`,
        })
        setFormVersion((version) => version + 1)
      }
      await loadPayments()
    } catch (error) {
      setNotice({
        type: 'error',
        message: getErrorMessage(
          error,
          editing ? 'Unable to update payment.' : 'Unable to add payment.'
        ),
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deletePayment(toDelete.id)
      setNotice({
        type: 'success',
        message: `Payment #${toDelete.id} was deleted.`,
      })
      if (editing?.id === toDelete.id) setEditing(null)
      setToDelete(null)
      await loadPayments()
    } catch (error) {
      setNotice({
        type: 'error',
        message: getErrorMessage(error, 'Unable to delete payment.'),
      })
      setToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  const filteredPayments = searchId.trim() === ''
    ? payments
    : payments.filter(
        (payment) => String(payment.id) === searchId.trim()
      )

  const handleEdit = (payment) => {
    setNotice(null)
    setEditing(payment)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="page">
      <h1 className="page__title">Payments</h1>

      {notice && (
        <Alert type={notice.type} onDismiss={() => setNotice(null)}>
          {notice.message}
        </Alert>
      )}

      <div className="students-layout">
        <PaymentForm
          key={editing ? `edit-${editing.id}` : `add-${formVersion}`}
          payment={editing}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />

        <div className="card">
          <div className="card__header">
            <h2 className="card__title">
              All Payments
              {!loading && !loadError && ` (${filteredPayments.length})`}
            </h2>
            <button
              type="button"
              className="btn btn--small btn--secondary"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>

          <div className="payment-search">
            <label htmlFor="payment-search-id">Search by Payment ID</label>
            <div className="payment-search__controls">
              <input
                id="payment-search-id"
                type="number"
                min="1"
                step="1"
                value={searchId}
                onChange={(event) => setSearchId(event.target.value)}
                placeholder="Enter exact payment ID"
              />
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setSearchId('')}
              >
                Clear
              </button>
            </div>
            <p className="field__hint">
              Exact ID match only; other fields are not searched.
            </p>
          </div>

          {loading && payments.length === 0 && !loadError && (
            <p className="state-message">Loading payments…</p>
          )}

          {loadError && <Alert type="error">{loadError}</Alert>}

          {!loading && !loadError && payments.length === 0 && (
            <p className="state-message">
              No payments found. Add the first payment using the form.
            </p>
          )}

          {!loadError && payments.length > 0 && filteredPayments.length === 0 && (
            <p className="state-message">
              No payment found with ID {searchId}.
            </p>
          )}

          {!loadError && filteredPayments.length > 0 && (
            <PaymentTable
              payments={filteredPayments}
              editingId={editing?.id}
              onEdit={handleEdit}
              onDelete={setToDelete}
            />
          )}
        </div>
      </div>

      {toDelete && (
        <ConfirmDialog
          title="Delete payment"
          message={`Delete payment #${toDelete.id}? This cannot be undone.`}
          confirmLabel="Delete"
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </section>
  )
}
