
import { useState } from 'react'

function getInitialValues(course) {
  return {
    coursename: course?.coursename ?? '',
    duration: course?.duration ?? '',
    fee: course ? String(course.fee) : '',
  }
}

function validate(values) {
  const errors = {}

  if (!values.coursename.trim()) {
    errors.coursename = 'Enter the course name.'
  }

  if (!values.duration.trim()) {
    errors.duration = 'Enter the course duration.'
  }

  if (values.fee.trim() === '') {
    errors.fee = 'Enter the course fee.'
  } else if (!/^\d+$/.test(values.fee.trim())) {
    errors.fee = 'Fee must be a whole number.'
  } else if (Number(values.fee) > 2147483647) {
    errors.fee = 'Fee exceeds the supported integer limit.'
  }

  return errors
}

export default function CourseForm({
  course,
  submitting,
  onSubmit,
  onCancel,
}) {
  const isEdit = Boolean(course)

  const [values, setValues] = useState(() => getInitialValues(course))
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target

    setValues((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = validate(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    onSubmit({
      coursename: values.coursename.trim(),
      duration: values.duration.trim(),
      fee: Number(values.fee.trim()),
    })
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2 className="card__title">
        {isEdit ? `Edit course #${course.id}` : 'Add course'}
      </h2>

      <div className="form__fields course-form__fields">
        <div className="field">
          <label htmlFor="course-name">Course name</label>
          <input
            id="course-name"
            name="coursename"
            type="text"
            value={values.coursename}
            onChange={handleChange}
            placeholder="e.g. Java Programming"
            aria-invalid={Boolean(errors.coursename)}
          />
          {errors.coursename && (
            <p className="field__error">{errors.coursename}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="course-duration">Duration</label>
          <input
            id="course-duration"
            name="duration"
            type="text"
            value={values.duration}
            onChange={handleChange}
            placeholder="e.g. 3 months"
            aria-invalid={Boolean(errors.duration)}
          />
          {errors.duration && (
            <p className="field__error">{errors.duration}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="course-fee">Fee (₹)</label>
          <input
            id="course-fee"
            name="fee"
            type="number"
            min="0"
            step="1"
            value={values.fee}
            onChange={handleChange}
            placeholder="e.g. 5000"
            aria-invalid={Boolean(errors.fee)}
          />
          {errors.fee && (
            <p className="field__error">{errors.fee}</p>
          )}
        </div>
      </div>

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
              : 'Add course'}
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
