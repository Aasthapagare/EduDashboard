
import { useState } from 'react'

export default function AssignmentForm({
  assignment,
  submitting,
  onSubmit,
  onCancel,
}) {
  const isEdit = Boolean(assignment)

  const [values, setValues] = useState(() => ({
    title: assignment?.title ?? '',
    description: assignment?.description ?? '',
    courseId: String(assignment?.courseId ?? ''),
    instructorId: String(assignment?.instructorId ?? ''),
    dueDate: assignment?.dueDate ?? '',
  }))

  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setValues((current) => ({
      ...current,
      [name]: value,
    }))

    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!values.title.trim() || !values.description.trim()) {
      setError('Title aur description dono bharna zaroori hai.')
      return
    }

    if (
      !/^[1-9]\d*$/.test(values.courseId) ||
      !/^[1-9]\d*$/.test(values.instructorId)
    ) {
      setError('Valid Course ID aur Instructor ID enter karo.')
      return
    }

    if (!values.dueDate) {
      setError('Assignment ki due date select karo.')
      return
    }

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      courseId: Number(values.courseId),
      instructorId: Number(values.instructorId),
      dueDate: values.dueDate,
    })
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2 className="card__title">
        {isEdit
          ? `Edit Assignment #${assignment.id}`
          : 'Add Assignment'}
      </h2>

      <div className="form__fields">
        <div className="field">
          <label htmlFor="assignment-title">
            Assignment Title
          </label>

          <input
            id="assignment-title"
            name="title"
            type="text"
            value={values.title}
            onChange={handleChange}
            placeholder="Enter assignment title"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="assignment-description">
            Description
          </label>

          <textarea
            id="assignment-description"
            name="description"
            value={values.description}
            onChange={handleChange}
            placeholder="Enter assignment description"
            rows={4}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="assignment-course">
            Course ID
          </label>

          <input
            id="assignment-course"
            name="courseId"
            type="number"
            min="1"
            step="1"
            value={values.courseId}
            onChange={handleChange}
            placeholder="Enter existing Course ID"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="assignment-instructor">
            Instructor ID
          </label>

          <input
            id="assignment-instructor"
            name="instructorId"
            type="number"
            min="1"
            step="1"
            value={values.instructorId}
            onChange={handleChange}
            placeholder="Enter existing Instructor ID"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="assignment-due-date">
            Due Date
          </label>

          <input
            id="assignment-due-date"
            name="dueDate"
            type="date"
            value={values.dueDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}

      <div className="form__actions">
        <button
          type="submit"
          className="btn btn--primary"
          disabled={submitting}
        >
          {submitting
            ? 'Saving...'
            : isEdit
              ? 'Save Changes'
              : 'Add Assignment'}
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
