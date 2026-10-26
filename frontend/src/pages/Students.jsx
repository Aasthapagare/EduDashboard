import { useCallback, useEffect, useState } from 'react'
import Alert from '../components/Alert'
import ConfirmDialog from '../components/ConfirmDialog'
import StudentForm from '../components/StudentForm'
import StudentTable from '../components/StudentTable'
import { getErrorMessage } from '../services/api'
import { createStudent, deleteStudent, getStudents, updateStudent } from '../services/studentService'

// Fetches the list and reports the outcome without touching component state.
async function fetchStudents() {
  try {
    const data = await getStudents()
    if (!Array.isArray(data)) return { error: 'The Student Service returned an unexpected response.' }
    return { data }
  } catch (error) {
    return { error: getErrorMessage(error, 'Unable to load students.') }
  }
}

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [notice, setNotice] = useState(null) // { type: 'success' | 'error', message }
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formVersion, setFormVersion] = useState(0) // bumped to clear the add form after a save
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const applyResult = useCallback((result) => {
    if (result.error) {
      setLoadError(result.error)
    } else {
      setStudents(result.data)
      setLoadError(null)
    }
    setLoading(false)
  }, [])

  const loadStudents = useCallback(async () => {
    applyResult(await fetchStudents())
  }, [applyResult])

  useEffect(() => {
    let active = true
    fetchStudents().then((result) => {
      if (active) applyResult(result)
    })
    return () => {
      active = false
    }
  }, [applyResult])

  const handleRefresh = () => {
    setLoading(true)
    loadStudents()
  }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setNotice(null)
    try {
      if (editing) {
        await updateStudent({ id: editing.id, ...values })
        setNotice({ type: 'success', message: `Student #${editing.id} was updated.` })
        setEditing(null)
      } else {
        const created = await createStudent(values)
        setNotice({ type: 'success', message: `Student "${created.name}" was added with ID ${created.id}.` })
        setFormVersion((version) => version + 1)
      }
      await loadStudents()
    } catch (error) {
      setNotice({
        type: 'error',
        message: getErrorMessage(error, editing ? 'Unable to update the student.' : 'Unable to add the student.'),
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteStudent(toDelete.id)
      setNotice({ type: 'success', message: `Student "${toDelete.name}" was deleted.` })
      if (editing?.id === toDelete.id) setEditing(null)
      setToDelete(null)
      await loadStudents()
    } catch (error) {
      setNotice({ type: 'error', message: getErrorMessage(error, 'Unable to delete the student.') })
      setToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  const handleEdit = (student) => {
    setNotice(null)
    setEditing(student)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="page">
      <h1 className="page__title">Students</h1>

      {notice && (
        <Alert type={notice.type} onDismiss={() => setNotice(null)}>
          {notice.message}
        </Alert>
      )}

      <div className="students-layout">
        <StudentForm
          key={editing ? `edit-${editing.id}` : `add-${formVersion}`}
          student={editing}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />

        <div className="card">
          <div className="card__header">
            <h2 className="card__title">
              All students{!loading && !loadError ? ` (${students.length})` : ''}
            </h2>
            <button type="button" className="btn btn--small btn--secondary" onClick={handleRefresh} disabled={loading}>
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>

          {loading && students.length === 0 && !loadError && <p className="state-message">Loading students…</p>}

          {loadError && (
            <Alert type="error">{loadError}</Alert>
          )}

          {!loading && !loadError && students.length === 0 && (
            <p className="state-message">No students found. Add the first student using the form.</p>
          )}

          {students.length > 0 && (
            <StudentTable
              students={students}
              editingId={editing?.id}
              onEdit={handleEdit}
              onDelete={setToDelete}
            />
          )}
        </div>
      </div>

      {toDelete && (
        <ConfirmDialog
          title="Delete student"
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
