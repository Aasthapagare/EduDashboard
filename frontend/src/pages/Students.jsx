// import { useCallback, useEffect, useState } from 'react'
// import Alert from '../components/Alert'
// import ConfirmDialog from '../components/ConfirmDialog'
// import StudentForm from '../components/StudentForm'
// import StudentTable from '../components/StudentTable'
// import { getErrorMessage } from '../services/api'
// import { createStudent, deleteStudent, getStudents, updateStudent } from '../services/studentService'

// // Fetches the list and reports the outcome without touching component state.
// async function fetchStudents() {
//   try {
//     const data = await getStudents()
//     if (!Array.isArray(data)) return { error: 'The Student Service returned an unexpected response.' }
//     return { data }
//   } catch (error) {
//     return { error: getErrorMessage(error, 'Unable to load students.') }
//   }
// }

// export default function Students() {
//   const [students, setStudents] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [loadError, setLoadError] = useState(null)
//   const [notice, setNotice] = useState(null) // { type: 'success' | 'error', message }
//   const [editing, setEditing] = useState(null)
//   const [submitting, setSubmitting] = useState(false)
//   const [formVersion, setFormVersion] = useState(0) // bumped to clear the add form after a save
//   const [toDelete, setToDelete] = useState(null)
//   const [deleting, setDeleting] = useState(false)

//   const applyResult = useCallback((result) => {
//     if (result.error) {
//       setLoadError(result.error)
//     } else {
//       setStudents(result.data)
//       setLoadError(null)
//     }
//     setLoading(false)
//   }, [])

//   const loadStudents = useCallback(async () => {
//     applyResult(await fetchStudents())
//   }, [applyResult])

//   useEffect(() => {
//     let active = true
//     fetchStudents().then((result) => {
//       if (active) applyResult(result)
//     })
//     return () => {
//       active = false
//     }
//   }, [applyResult])

//   const handleRefresh = () => {
//     setLoading(true)
//     loadStudents()
//   }

//   const handleSubmit = async (values) => {
//     setSubmitting(true)
//     setNotice(null)
//     try {
//       if (editing) {
//         await updateStudent({ id: editing.id, ...values })
//         setNotice({ type: 'success', message: `Student #${editing.id} was updated.` })
//         setEditing(null)
//       } else {
//         const created = await createStudent(values)
//         setNotice({ type: 'success', message: `Student "${created.name}" was added with ID ${created.id}.` })
//         setFormVersion((version) => version + 1)
//       }
//       await loadStudents()
//     } catch (error) {
//       setNotice({
//         type: 'error',
//         message: getErrorMessage(error, editing ? 'Unable to update the student.' : 'Unable to add the student.'),
//       })
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleConfirmDelete = async () => {
//     setDeleting(true)
//     try {
//       await deleteStudent(toDelete.id)
//       setNotice({ type: 'success', message: `Student "${toDelete.name}" was deleted.` })
//       if (editing?.id === toDelete.id) setEditing(null)
//       setToDelete(null)
//       await loadStudents()
//     } catch (error) {
//       setNotice({ type: 'error', message: getErrorMessage(error, 'Unable to delete the student.') })
//       setToDelete(null)
//     } finally {
//       setDeleting(false)
//     }
//   }

//   const handleEdit = (student) => {
//     setNotice(null)
//     setEditing(student)
//     window.scrollTo({ top: 0, behavior: 'smooth' })
//   }

//   return (
//     <section className="page">
//       <h1 className="page__title">Students</h1>

//       {notice && (
//         <Alert type={notice.type} onDismiss={() => setNotice(null)}>
//           {notice.message}
//         </Alert>
//       )}

//       <div className="students-layout">
//         <StudentForm
//           key={editing ? `edit-${editing.id}` : `add-${formVersion}`}
//           student={editing}
//           submitting={submitting}
//           onSubmit={handleSubmit}
//           onCancel={() => setEditing(null)}
//         />

//         <div className="card">
//           <div className="card__header">
//             <h2 className="card__title">
//               All students{!loading && !loadError ? ` (${students.length})` : ''}
//             </h2>
//             <button type="button" className="btn btn--small btn--secondary" onClick={handleRefresh} disabled={loading}>
//               {loading ? 'Loading…' : 'Refresh'}
//             </button>
//           </div>

//           {loading && students.length === 0 && !loadError && <p className="state-message">Loading students…</p>}

//           {loadError && (
//             <Alert type="error">{loadError}</Alert>
//           )}

//           {!loading && !loadError && students.length === 0 && (
//             <p className="state-message">No students found. Add the first student using the form.</p>
//           )}

//           {students.length > 0 && (
//             <StudentTable
//               students={students}
//               editingId={editing?.id}
//               onEdit={handleEdit}
//               onDelete={setToDelete}
//             />
//           )}
//         </div>
//       </div>

//       {toDelete && (
//         <ConfirmDialog
//           title="Delete student"
//           message={`Delete ${toDelete.name} (ID ${toDelete.id})? This cannot be undone.`}
//           confirmLabel="Delete"
//           busy={deleting}
//           onConfirm={handleConfirmDelete}
//           onCancel={() => setToDelete(null)}
//         />
//       )}
//     </section>
//   )
// }


import { useCallback, useEffect, useMemo, useState } from 'react'
import Alert from '../components/Alert'
import ConfirmDialog from '../components/ConfirmDialog'
import StudentForm from '../components/StudentForm'
import StudentTable from '../components/StudentTable'
import { getErrorMessage } from '../services/api'
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from '../services/studentService'

async function fetchStudents() {
  try {
    const data = await getStudents()

    if (!Array.isArray(data)) {
      return {
        error: 'The Student Service returned an unexpected response.',
      }
    }

    return { data }
  } catch (error) {
    return {
      error: getErrorMessage(error, 'Unable to load students.'),
    }
  }
}

export default function Students() {
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
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
      if (active) {
        applyResult(result)
      }
    })

    return () => {
      active = false
    }
  }, [applyResult])

  // Search students by ID, name, or email.
  
const filteredStudents = useMemo(() => {
  const query = searchTerm.trim().toLowerCase()

  if (!query) {
    return students
  }

  return students.filter((student) =>
    String(student.id ?? '').toLowerCase().includes(query)
  )
}, [students, searchTerm])

  const handleRefresh = () => {
    setLoading(true)
    loadStudents()
  }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setNotice(null)

    try {
      if (editing) {
        await updateStudent({
          id: editing.id,
          ...values,
        })

        setNotice({
          type: 'success',
          message: `Student #${editing.id} was updated.`,
        })

        setEditing(null)
      } else {
        const created = await createStudent(values)

        setNotice({
          type: 'success',
          message: `Student "${created.name}" was added with ID ${created.id}.`,
        })

        setFormVersion((version) => version + 1)
      }

      await loadStudents()
    } catch (error) {
      setNotice({
        type: 'error',
        message: getErrorMessage(
          error,
          editing
            ? 'Unable to update the student.'
            : 'Unable to add the student.',
        ),
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    setDeleting(true)

    try {
      await deleteStudent(toDelete.id)

      setNotice({
        type: 'success',
        message: `Student "${toDelete.name}" was deleted.`,
      })

      if (editing?.id === toDelete.id) {
        setEditing(null)
      }

      setToDelete(null)
      await loadStudents()
    } catch (error) {
      setNotice({
        type: 'error',
        message: getErrorMessage(
          error,
          'Unable to delete the student.',
        ),
      })

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

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  return (
    <section className="page">
      <h1 className="page__title">Students</h1>

      {notice && (
        <Alert
          type={notice.type}
          onDismiss={() => setNotice(null)}
        >
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
          <div className="card__header students-header">
            <div>
              <h2 className="card__title">
                All students
                {!loading && !loadError && (
                  <span className="students-count">
                    {' '}({filteredStudents.length}
                    {searchTerm.trim() ? ` of ${students.length}` : ''})
                  </span>
                )}
              </h2>
            </div>

            <button
              type="button"
              className="btn btn--small btn--secondary"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>

          <div className="student-search">
            
<label
  className="student-search__label"
  htmlFor="student-search-input"
>
  Search by Student ID
</label>

<div className="student-search__controls">
  <input
    id="student-search-input"
    type="search"
    className="student-search__input"
    placeholder="Enter student ID..."
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
    aria-label="Search by student ID"
  />

  {searchTerm && (
    <button
      type="button"
      className="btn btn--small btn--secondary"
      onClick={handleClearSearch}
    >
      Clear
    </button>
  )}
</div>


            <p className="student-search__hint">
              Search updates automatically as you type.
            </p>
          </div>

          {loading && students.length === 0 && !loadError && (
            <p className="state-message">Loading students…</p>
          )}

          {loadError && (
            <Alert type="error">{loadError}</Alert>
          )}

          {!loading && !loadError && students.length === 0 && (
            <p className="state-message">
              No students found. Add the first student using the form.
            </p>
          )}

          {!loading &&
            !loadError &&
            students.length > 0 &&
            filteredStudents.length === 0 && (
              <p className="state-message">
                No matching students found. Try another ID, name, or email.
              </p>
            )}

          {!loadError && filteredStudents.length > 0 && (
            <StudentTable
              students={filteredStudents}
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
