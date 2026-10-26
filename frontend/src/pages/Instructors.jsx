
import { useCallback, useEffect, useMemo, useState } from 'react'
import Alert from '../components/Alert'
import ConfirmDialog from '../components/ConfirmDialog'
import InstructorForm from '../components/InstructorForm'
import InstructorTable from '../components/InstructorTable'
import {
  createInstructor,
  deleteInstructor,
  getInstructorErrorMessage,
  getInstructors,
  updateInstructor,
} from '../services/instructorService'

async function fetchInstructors() {
  try {
    const data = await getInstructors()

    if (!Array.isArray(data)) {
      return {
        error: 'The Instructor Service returned an unexpected response.',
      }
    }

    return { data }
  } catch (error) {
    return {
      error: getInstructorErrorMessage(
        error,
        'Unable to load instructors.'
      ),
    }
  }
}

export default function Instructors() {
  const [instructors, setInstructors] = useState([])
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
      setInstructors(result.data)
      setLoadError(null)
    }

    setLoading(false)
  }, [])

  const loadInstructors = useCallback(async () => {
    applyResult(await fetchInstructors())
  }, [applyResult])

  useEffect(() => {
    let active = true

    fetchInstructors().then((result) => {
      if (active) applyResult(result)
    })

    return () => {
      active = false
    }
  }, [applyResult])

  // Exact ID search only.
  const filteredInstructors = useMemo(() => {
    const query = searchId.trim()

    if (!query) return instructors

    return instructors.filter(
      (instructor) => String(instructor.id) === query
    )
  }, [instructors, searchId])

  function handleRefresh() {
    setLoading(true)
    loadInstructors()
  }

  async function handleSubmit(values) {
    setSubmitting(true)
    setNotice(null)

    try {
      if (editing) {
        await updateInstructor({
          id: editing.id,
          ...values,
        })

        setNotice({
          type: 'success',
          message: `Instructor #${editing.id} was updated.`,
        })

        setEditing(null)
      } else {
        const created = await createInstructor(values)

        setNotice({
          type: 'success',
          message: `Instructor "${created.name}" was added${
            created.id != null ? ` with ID ${created.id}` : ''
          }.`,
        })

        setFormVersion((version) => version + 1)
      }

      await loadInstructors()
    } catch (error) {
      setNotice({
        type: 'error',
        message: getInstructorErrorMessage(
          error,
          editing
            ? 'Unable to update the instructor.'
            : 'Unable to add the instructor.'
        ),
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleConfirmDelete() {
    setDeleting(true)

    try {
      await deleteInstructor(toDelete.id)

      setNotice({
        type: 'success',
        message: `Instructor "${toDelete.name}" was deleted.`,
      })

      if (editing?.id === toDelete.id) {
        setEditing(null)
      }

      setToDelete(null)
      await loadInstructors()
    } catch (error) {
      setNotice({
        type: 'error',
        message: getInstructorErrorMessage(
          error,
          'Unable to delete the instructor.'
        ),
      })

      setToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  function handleEdit(instructor) {
    setNotice(null)
    setEditing(instructor)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="page">
      <h1 className="page__title">Instructors</h1>

      {notice && (
        <Alert
          type={notice.type}
          onDismiss={() => setNotice(null)}
        >
          {notice.message}
        </Alert>
      )}

      <div className="students-layout">
        <InstructorForm
          key={
            editing
              ? `edit-${editing.id}`
              : `add-${formVersion}`
          }
          instructor={editing}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />

        <div className="card">
          <div className="card__header">
            <h2 className="card__title">
              All instructors
              {!loading && !loadError
                ? ` (${filteredInstructors.length}${
                    searchId.trim()
                      ? ` of ${instructors.length}`
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

          <div className="instructor-search">
            <label
              className="instructor-search__label"
              htmlFor="instructor-id-search"
            >
              Search by Instructor ID
            </label>

            <div className="instructor-search__controls">
              <input
                id="instructor-id-search"
                className="instructor-search__input"
                type="search"
                inputMode="numeric"
                placeholder="Enter exact instructor ID..."
                value={searchId}
                onChange={(event) =>
                  setSearchId(
                    event.target.value.replace(/[^0-9]/g, '')
                  )
                }
                aria-label="Search by exact instructor ID"
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

            <p className="instructor-search__hint">
              Enter the complete instructor ID to find a record.
            </p>
          </div>

          {loading && instructors.length === 0 && !loadError && (
            <p className="state-message">Loading instructors…</p>
          )}

          {loadError && <Alert type="error">{loadError}</Alert>}

          {!loading && !loadError && instructors.length === 0 && (
            <p className="state-message">
              No instructors found. Add the first instructor using the form.
            </p>
          )}

          {!loading &&
            !loadError &&
            instructors.length > 0 &&
            filteredInstructors.length === 0 && (
              <p className="state-message">
                No instructor found with ID {searchId}.
              </p>
            )}

          {!loadError && filteredInstructors.length > 0 && (
            <InstructorTable
              instructors={filteredInstructors}
              editingId={editing?.id}
              onEdit={handleEdit}
              onDelete={setToDelete}
            />
          )}
        </div>
      </div>

      {toDelete && (
        <ConfirmDialog
          title="Delete instructor"
          message={`Delete ${toDelete.name} (ID ${toDelete.id})? This cannot be undone.`}
          confirmLabel="Delete"
          busy={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </section>
  )
}
