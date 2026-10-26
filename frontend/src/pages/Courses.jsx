
import { useCallback, useEffect, useMemo, useState } from 'react'
import Alert from '../components/Alert'
import ConfirmDialog from '../components/ConfirmDialog'
import CourseForm from '../components/CourseForm'
import CourseTable from '../components/CourseTable'
import {
  createCourse,
  deleteCourse,
  getCourseErrorMessage,
  getCourses,
  updateCourse,
} from '../services/courseService'

async function fetchCourses() {
  try {
    const data = await getCourses()

    if (!Array.isArray(data)) {
      return { error: 'Unexpected response from Course Service.' }
    }

    return { data }
  } catch (error) {
    return {
      error: getCourseErrorMessage(error, 'Unable to load courses.'),
    }
  }
}

export default function Courses() {
  const [courses, setCourses] = useState([])
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
      setCourses(result.data)
      setLoadError(null)
    }

    setLoading(false)
  }, [])

  const loadCourses = useCallback(async () => {
    applyResult(await fetchCourses())
  }, [applyResult])

  useEffect(() => {
    let active = true

    fetchCourses().then((result) => {
      if (active) applyResult(result)
    })

    return () => {
      active = false
    }
  }, [applyResult])

  // Exact ID search: searching for 12 will not match ID 123.
  const filteredCourses = useMemo(() => {
    const query = searchId.trim()

    if (!query) return courses

    return courses.filter(
      (course) => String(course.id) === query,
    )
  }, [courses, searchId])

  function handleRefresh() {
    setLoading(true)
    loadCourses()
  }

  async function handleSubmit(values) {
    setSubmitting(true)
    setNotice(null)

    try {
      if (editing) {
        await updateCourse({
          id: editing.id,
          ...values,
        })

        setNotice({
          type: 'success',
          message: `Course #${editing.id} was updated.`,
        })

        setEditing(null)
      } else {
        const created = await createCourse(values)

        setNotice({
          type: 'success',
          message: `Course "${created.coursename}" was added${
            created.id != null ? ` with ID ${created.id}` : ''
          }.`,
        })

        setFormVersion((version) => version + 1)
      }

      await loadCourses()
    } catch (error) {
      setNotice({
        type: 'error',
        message: getCourseErrorMessage(
          error,
          editing
            ? 'Unable to update the course.'
            : 'Unable to add the course.',
        ),
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleConfirmDelete() {
    setDeleting(true)

    try {
      await deleteCourse(toDelete.id)

      setNotice({
        type: 'success',
        message: `Course "${toDelete.coursename}" was deleted.`,
      })

      if (editing?.id === toDelete.id) {
        setEditing(null)
      }

      setToDelete(null)
      await loadCourses()
    } catch (error) {
      setNotice({
        type: 'error',
        message: getCourseErrorMessage(
          error,
          'Unable to delete the course.',
        ),
      })

      setToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  function handleEdit(course) {
    setNotice(null)
    setEditing(course)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="page">
      <h1 className="page__title">Courses</h1>

      {notice && (
        <Alert
          type={notice.type}
          onDismiss={() => setNotice(null)}
        >
          {notice.message}
        </Alert>
      )}

      <div className="students-layout">
        <CourseForm
          key={editing ? `edit-${editing.id}` : `add-${formVersion}`}
          course={editing}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />

        <div className="card">
          <div className="card__header">
            <h2 className="card__title">
              All courses
              {!loading && !loadError
                ? ` (${filteredCourses.length}${
                    searchId.trim() ? ` of ${courses.length}` : ''
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

          <div className="course-search">
            <label
              className="course-search__label"
              htmlFor="course-id-search"
            >
              Search by Course ID
            </label>

            <div className="course-search__controls">
              <input
                id="course-id-search"
                className="course-search__input"
                type="search"
                inputMode="numeric"
                placeholder="Enter exact course ID..."
                value={searchId}
                onChange={(event) =>
                  setSearchId(event.target.value.replace(/[^0-9]/g, ''))
                }
                aria-label="Search by exact course ID"
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

            <p className="course-search__hint">
              Enter the complete course ID to find a course.
            </p>
          </div>

          {loading && courses.length === 0 && !loadError && (
            <p className="state-message">Loading courses…</p>
          )}

          {loadError && <Alert type="error">{loadError}</Alert>}

          {!loading && !loadError && courses.length === 0 && (
            <p className="state-message">
              No courses found. Add the first course using the form.
            </p>
          )}

          {!loading &&
            !loadError &&
            courses.length > 0 &&
            filteredCourses.length === 0 && (
              <p className="state-message">
                No course found with ID {searchId}.
              </p>
            )}

          {!loadError && filteredCourses.length > 0 && (
            <CourseTable
              courses={filteredCourses}
              editingId={editing?.id}
              onEdit={handleEdit}
              onDelete={setToDelete}
            />
          )}
        </div>
      </div>

      {toDelete && (
        <ConfirmDialog
          title="Delete course"
          message={`Delete ${toDelete.coursename} (ID ${toDelete.id})? This cannot be undone.`}
          confirmLabel="Delete"
          busy={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </section>
  )
}
