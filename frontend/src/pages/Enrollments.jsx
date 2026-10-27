
import { useCallback, useEffect, useMemo, useState } from 'react'
import Alert from '../components/Alert'
import ConfirmDialog from '../components/ConfirmDialog'
import EnrollmentForm from '../components/EnrollmentForm'
import EnrollmentTable from '../components/EnrollmentTable'
import {
  createEnrollment,
  deleteEnrollment,
  getEnrollmentErrorMessage,
  getEnrollments,
  updateEnrollment,
} from '../services/enrollmentService'

async function fetchEnrollments() {
  try {
    const data = await getEnrollments()

    if (!Array.isArray(data)) {
      return {
        error: 'The Enrollment Service returned an unexpected response.',
      }
    }

    return { data }
  } catch (error) {
    return {
      error: getEnrollmentErrorMessage(
        error,
        'Unable to load enrollments.'
      ),
    }
  }
}

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([])
  const [searchId, setSearchId] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formVersion, setFormVersion] = useState(0)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const applyResult = useCallback((result) => {
    if (result.error) {
      setLoadError(result.error)
    } else {
      setEnrollments(result.data)
      setLoadError(null)
    }

    setLoading(false)
  }, [])

  const loadEnrollments = useCallback(async () => {
    applyResult(await fetchEnrollments())
  }, [applyResult])

  useEffect(() => {
    let active = true

    fetchEnrollments().then((result) => {
      if (active) applyResult(result)
    })

    return () => {
      active = false
    }
  }, [applyResult])

  const filteredEnrollments = useMemo(() => {
    const query = searchId.trim()

    if (!query) return enrollments

    return enrollments.filter(
      (enrollment) => String(enrollment.id) === query
    )
  }, [enrollments, searchId])

  function handleRefresh() {
    setLoading(true)
    loadEnrollments()
  }

  async function handleSubmit(values) {
    setSubmitting(true)
    setNotice(null)

    try {
      if (editing) {
        await updateEnrollment({
          ...editing,
          ...values,
          id: editing.id,
          enrollmentDate: editing.enrollmentDate,
        })

        setNotice({
          type: 'success',
          message: `Enrollment #${editing.id} was updated.`,
        })

        setEditing(null)
      } else {
        const created = await createEnrollment(values)

        setNotice({
          type: 'success',
          message: `Enrollment was created${
            created?.id != null ? ` with ID ${created.id}` : ''
          }.`,
        })

        setFormVersion((version) => version + 1)
      }

      await loadEnrollments()
    } catch (error) {
      setNotice({
        type: 'error',
        message: getEnrollmentErrorMessage(
          error,
          editing
            ? 'Unable to update the enrollment.'
            : 'Unable to create the enrollment.'
        ),
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleConfirmDelete() {
    setDeleting(true)

    try {
      await deleteEnrollment(toDelete.id)

      setNotice({
        type: 'success',
        message: `Enrollment #${toDelete.id} was deleted.`,
      })

      if (editing?.id === toDelete.id) {
        setEditing(null)
      }

      setToDelete(null)
      await loadEnrollments()
    } catch (error) {
      setNotice({
        type: 'error',
        message: getEnrollmentErrorMessage(
          error,
          'Unable to delete the enrollment.'
        ),
      })

      setToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  function handleEdit(enrollment) {
    setNotice(null)
    setEditing(enrollment)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="page">
      <h1 className="page__title">Enrollments</h1>

      {notice && (
        <Alert
          type={notice.type}
          onDismiss={() => setNotice(null)}
        >
          {notice.message}
        </Alert>
      )}

      <div className="students-layout">
        <EnrollmentForm
          key={
            editing
              ? `edit-${editing.id}`
              : `add-${formVersion}`
          }
          enrollment={editing}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />

        <div className="card">
          <div className="card__header">
            <h2 className="card__title">
              All enrollments
              {!loading && !loadError
                ? ` (${filteredEnrollments.length}${
                    searchId.trim()
                      ? ` of ${enrollments.length}`
                      : ''
                  })`
                : ''}
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

          <div className="enrollment-search">
            <label
              className="enrollment-search__label"
              htmlFor="enrollment-id-search"
            >
              Search by Enrollment ID
            </label>

            <div className="enrollment-search__controls">
              <input
                id="enrollment-id-search"
                className="enrollment-search__input"
                type="search"
                inputMode="numeric"
                placeholder="Enter exact enrollment ID..."
                value={searchId}
                onChange={(event) =>
                  setSearchId(
                    event.target.value.replace(/[^0-9]/g, '')
                  )
                }
                aria-label="Search by exact enrollment ID"
              />

              {searchId && (
                <button
                  type="button"
                  className="btn btn--small btn--secondary"
                  onClick={() => setSearchId('')}
                >
                  Clear
                </button>
              )}
            </div>

            <p className="enrollment-search__hint">
              Enter the complete enrollment ID to find a record.
            </p>
          </div>

          {loading && enrollments.length === 0 && !loadError && (
            <p className="state-message">Loading enrollments…</p>
          )}

          {loadError && <Alert type="error">{loadError}</Alert>}

          {!loading && !loadError && enrollments.length === 0 && (
            <p className="state-message">
              No enrollments found. Create the first enrollment using the form.
            </p>
          )}

          {!loading &&
            !loadError &&
            enrollments.length > 0 &&
            filteredEnrollments.length === 0 && (
              <p className="state-message">
                No enrollment found with ID {searchId}.
              </p>
            )}

          {!loadError && filteredEnrollments.length > 0 && (
            <EnrollmentTable
              enrollments={filteredEnrollments}
              editingId={editing?.id}
              onEdit={handleEdit}
              onDelete={setToDelete}
            />
          )}
        </div>
      </div>

      {toDelete && (
        <ConfirmDialog
          title="Delete enrollment"
          message={`Delete enrollment #${toDelete.id} for Student #${toDelete.studentId} and Course #${toDelete.courseId}? This cannot be undone.`}
          confirmLabel="Delete"
          busy={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </section>
  )
}
