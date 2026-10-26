
import { useState } from 'react'

function getInitialValues(instructor) {
  return {
    name: instructor?.name ?? '',
    email: instructor?.email ?? '',
    specialization: instructor?.specialization ?? '',
  }
}

function validate(values) {
  const errors = {}

  if (!values.name.trim()) {
    errors.name = 'Enter the instructor name.'
  }

  if (!values.email.trim()) {
    errors.email = 'Enter the email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.specialization.trim()) {
    errors.specialization = 'Enter the specialization.'
  }

  return errors
}

export default function InstructorForm({
  instructor,
  submitting,
  onSubmit,
  onCancel,
}) {
  const isEdit = Boolean(instructor)

  const [values, setValues] = useState(() =>
    getInitialValues(instructor)
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
      name: values.name.trim(),
      email: values.email.trim(),
      specialization: values.specialization.trim(),
    })
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2 className="card__title">
        {isEdit
          ? `Edit instructor #${instructor.id}`
          : 'Add instructor'}
      </h2>

      <div className="form__fields">
        <div className="field">
          <label htmlFor="instructor-name">Name</label>
          <input
            id="instructor-name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            placeholder="Full name"
            autoComplete="off"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && (
            <p className="field__error">{errors.name}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="instructor-email">Email</label>
          <input
            id="instructor-email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="name@example.com"
            autoComplete="off"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (
            <p className="field__error">{errors.email}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="instructor-specialization">
            Specialization
          </label>
          <input
            id="instructor-specialization"
            name="specialization"
            type="text"
            value={values.specialization}
            onChange={handleChange}
            placeholder="e.g. Java, Data Science"
            autoComplete="off"
            aria-invalid={Boolean(errors.specialization)}
          />
          {errors.specialization && (
            <p className="field__error">
              {errors.specialization}
            </p>
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
              : 'Add instructor'}
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
