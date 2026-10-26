import { useState } from 'react'

const MAX_INT = 2147483647 // Student.mobile is a Java int in the backend
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function toFormValues(student) {
  return {
    name: student?.name ?? '',
    email: student?.email ?? '',
    mobile: student ? String(student.mobile) : '',
  }
}

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Enter the student name.'
  if (!values.email.trim()) errors.email = 'Enter the email address.'
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address.'
  const mobile = values.mobile.trim()
  if (!mobile) errors.mobile = 'Enter the mobile number.'
  else if (!/^\d+$/.test(mobile)) errors.mobile = 'Use digits only.'
  else if (Number(mobile) > MAX_INT)
    errors.mobile = `The backend stores mobile as a 32-bit integer, so the value cannot exceed ${MAX_INT.toLocaleString('en-US')}.`
  return errors
}

// Remount with a new `key` to reset the form when switching between add and edit.
export default function StudentForm({ student, submitting, onSubmit, onCancel }) {
  const isEdit = Boolean(student)
  const [values, setValues] = useState(() => toFormValues(student))
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      mobile: Number(values.mobile.trim()),
    })
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2 className="card__title">{isEdit ? `Edit student #${student.id}` : 'Add student'}</h2>

      <div className="form__fields">
      <div className="field">
        <label htmlFor="student-name">Name</label>
        <input
          id="student-name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          placeholder="Full name"
          autoComplete="off"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'student-name-error' : undefined}
        />
        {errors.name && (
          <p id="student-name-error" className="field__error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="student-email">Email</label>
        <input
          id="student-email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          placeholder="name@example.com"
          autoComplete="off"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'student-email-error' : undefined}
        />
        {errors.email && (
          <p id="student-email-error" className="field__error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="student-mobile">Mobile</label>
        <input
          id="student-mobile"
          name="mobile"
          type="text"
          inputMode="numeric"
          value={values.mobile}
          onChange={handleChange}
          placeholder="Digits only"
          autoComplete="off"
          aria-invalid={Boolean(errors.mobile)}
          aria-describedby="student-mobile-hint"
        />
        {errors.mobile ? (
          <p id="student-mobile-hint" className="field__error">
            {errors.mobile}
          </p>
        ) : (
          <p id="student-mobile-hint" className="field__hint">
            Maximum value 2,147,483,647 (backend integer limit).
          </p>
        )}
      </div>
      </div>

      <div className="form__actions">
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add student'}
        </button>
        {isEdit && (
          <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
