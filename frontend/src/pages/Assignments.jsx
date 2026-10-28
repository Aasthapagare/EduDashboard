
import { useCallback, useEffect, useState } from 'react'
import Alert from '../components/Alert'
import ConfirmDialog from '../components/ConfirmDialog'
import AssignmentForm from '../components/AssignmentForm'
import AssignmentTable from '../components/AssignmentTable'
import { getErrorMessage } from '../services/api'
import {
  createAssignment,
  deleteAssignment,
  getAssignments,
  updateAssignment,
} from '../services/assignmentService'
import '../styles/students.css'

async function fetchAssignments() {
  try {
    const data = await getAssignments()
    if (!Array.isArray(data)) {
      return { error: 'Assignment Service returned an unexpected response.' }
    }
    return { data }
  } catch (error) {
    return {
      error: getErrorMessage(error, 'Unable to load assignments.'),
    }
  }
}

export default function Assignments() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formVersion, setFormVersion] = useState(0)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [searchId, setSearchId] = useState('')

  const applyResult = useCallback((result) => {
    if (result.error) {
      setLoadError(result.error)
    } else {
      setAssignments(result.data)
      setLoadError(null)
    }
    setLoading(false)
  }, [])

  const loadAssignments = useCallback(async () => {
    applyResult(await fetchAssignments())
  }, [applyResult])

  useEffect(() => {
    let active = true
    fetchAssignments().then((result) => {
      if (active) applyResult(result)
    })
    return () => {
      active = false
    }
  }, [applyResult])

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setNotice(null)

    try {
      if (editing) {
        await updateAssignment({ id: editing.id, ...values })
        setNotice({
          type: 'success',
          message: `Assignment #${editing.id} was updated.`,
        })
        setEditing(null)
      } else {
        const created = await createAssignment(values)
        setNotice({
          type: 'success',
          message: `Assignment was added with ID ${created.id}.`,
        })
        setFormVersion((version) => version + 1)
      }
      await loadAssignments()
    } catch (error) {
      setNotice({
        type: 'error',
        message: getErrorMessage(
          error,
          editing ? 'Unable to update assignment.' : 'Unable to add assignment.'
        ),
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      await deleteAssignment(toDelete.id)
      setNotice({
        type: 'success',
        message: `Assignment #${toDelete.id} was deleted.`,
      })
      if (editing?.id === toDelete.id) setEditing(null)
      setToDelete(null)
      await loadAssignments()
    } catch (error) {
      setNotice({
        type: 'error',
        message: getErrorMessage(error, 'Unable to delete assignment.'),
      })
      setToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  const filteredAssignments = searchId.trim() === ''
    ? assignments
    : assignments.filter(
        (assignment) => String(assignment.id) === searchId.trim()
      )

  const handleEdit = (assignment) => {
    setNotice(null)
    setEditing(assignment)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="page">
      <h1 className="page__title">Assignments</h1>

      {notice && (
        <Alert type={notice.type} onDismiss={() => setNotice(null)}>
          {notice.message}
        </Alert>
      )}

      <div className="students-layout">
        <AssignmentForm
          key={editing ? `edit-${editing.id}` : `add-${formVersion}`}
          assignment={editing}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />

        <div className="card">
          <div className="card__header">
            <h2 className="card__title">
              All Assignments
              {!loading && !loadError && ` (${filteredAssignments.length})`}
            </h2>
            <button
              type="button"
              className="btn btn--small btn--secondary"
              onClick={() => {
                setLoading(true)
                loadAssignments()
              }}
              disabled={loading}
            >
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>

          <div className="assignment-search">
            <label htmlFor="assignment-search-id">Search by Assignment ID</label>
            <div className="assignment-search__controls">
              <input
                id="assignment-search-id"
                type="number"
                min="1"
                step="1"
                value={searchId}
                onChange={(event) => setSearchId(event.target.value)}
                placeholder="Enter exact assignment ID"
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
              Search matches the ID only, not the title or description.
            </p>
          </div>

          {loading && assignments.length === 0 && !loadError && (
            <p className="state-message">Loading assignments…</p>
          )}

          {loadError && <Alert type="error">{loadError}</Alert>}

          {!loading && !loadError && assignments.length === 0 && (
            <p className="state-message">
              No assignments found. Add the first assignment using the form.
            </p>
          )}

          {!loadError && assignments.length > 0 && filteredAssignments.length === 0 && (
            <p className="state-message">
              No assignment found with ID {searchId}.
            </p>
          )}

          {!loadError && filteredAssignments.length > 0 && (
            <AssignmentTable
              assignments={filteredAssignments}
              editingId={editing?.id}
              onEdit={handleEdit}
              onDelete={setToDelete}
            />
          )}
        </div>
      </div>

      {toDelete && (
        <ConfirmDialog
          title="Delete assignment"
          message={`Delete assignment #${toDelete.id} (${toDelete.title})? This cannot be undone.`}
          confirmLabel="Delete"
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </section>
  )
}
