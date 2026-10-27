
import { useState } from 'react'

function getInitialValues(enrollment) {
  return {
    studentId: enrollment ? String(enrollment.studentId) : '',
    courseId: enrollment ? String(enrollment.courseId) : '',
    status: enrollment?.status ?? 'Active',
  }
}

function validate(values) {
  const errors = {}

  if (!/^[1-9]\d*$/.test(values.studentId.trim())) {
    errors.studentId = 'Enter a valid positive Student ID.'
  }

  if (!/^[1-9]\d*$/.test(values.courseId.trim())) {
    errors.courseId = 'Enter a valid positive Course ID.'
  }

  if (!values.status.trim()) {
    errors.status = 'Enter an enrollment status.'
  }

  return errors
}

export default function EnrollmentForm({
  enrollment,
  submitting,
  onSubmit,
  onCancel,
}) {
  const isEdit = Boolean(enrollment)
  const [values, setValues] = useState(() =>
    getInitialValues(enrollment)
  )
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target

    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = validate(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length) return

    onSubmit({
      studentId: Number(values.studentId),
      courseId: Number(values.courseId),
      status: values.status.trim(),
    })
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2 className="card__title">
        {isEdit
          ? `Edit enrollment #${enrollment.id}`
          : 'Add enrollment'}
      </h2>

      <div className="form__fields">
        <div className="field">
          <label htmlFor="enrollment-student-id">Student ID</label>
          <input
            id="enrollment-student-id"
            name="studentId"
            type="number"
            min="1"
            step="1"
            value={values.studentId}
            onChange={handleChange}
            placeholder="Enter existing Student ID"
            aria-invalid={Boolean(errors.studentId)}
          />
          {errors.studentId && (
            <p className="field__error">{errors.studentId}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="enrollment-course-id">Course ID</label>
          <input
            id="enrollment-course-id"
            name="courseId"
            type="number"
            min="1"
            step="1"
            value={values.courseId}
            onChange={handleChange}
            placeholder="Enter existing Course ID"
            aria-invalid={Boolean(errors.courseId)}
          />
          {errors.courseId && (
            <p className="field__error">{errors.courseId}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="enrollment-status">Status</label>
          <input
            id="enrollment-status"
            name="status"
            type="text"
            value={values.status}
            onChange={handleChange}
            placeholder="e.g. Active"
            aria-invalid={Boolean(errors.status)}
          />
          {errors.status && (
            <p className="field__error">{errors.status}</p>
          )}
        </div>
      </div>

      {isEdit && (
        <p className="student-search__hint">
          Enrollment date is managed by the backend and is not editable here.
        </p>
      )}

      <div className="form__actions">
        <button
          type="submit"
          className="btn btn--primary"
          disabled={submitting}
        >
          {submitting
            ? 'Saving…'
            : isEdit
              ? 'Save changes'
              : 'Add enrollment'}
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
