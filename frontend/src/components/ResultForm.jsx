
import { useState } from 'react'

export default function ResultForm({
  result,
  submitting,
  onSubmit,
  onCancel,
}) {
  const isEdit = Boolean(result)

  const [values, setValues] = useState(() => ({
    studentId: String(result?.studentId ?? ''),
    assignmentId: String(result?.assignmentId ?? ''),
    enrollmentId: String(result?.enrollmentId ?? ''),
    marks: String(result?.marks ?? ''),
    grade: result?.grade ?? '',
    resultDate: result?.resultDate ?? '',
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

    const positiveIds = ['studentId', 'assignmentId', 'enrollmentId']

    if (
      positiveIds.some(
        (field) => !/^[1-9]\d*$/.test(values[field])
      )
    ) {
      setError('Student ID, Assignment ID aur Enrollment ID valid hone chahiye.')
      return
    }

    if (
      values.marks.trim() === '' ||
      !Number.isFinite(Number(values.marks)) ||
      Number(values.marks) < 0
    ) {
      setError('Marks valid non-negative number hone chahiye.')
      return
    }

    if (!values.grade.trim()) {
      setError('Grade enter karo.')
      return
    }

    if (!values.resultDate) {
      setError('Result Date select karo.')
      return
    }

    onSubmit({
      studentId: Number(values.studentId),
      assignmentId: Number(values.assignmentId),
      enrollmentId: Number(values.enrollmentId),
      marks: Number(values.marks),
      grade: values.grade.trim(),
      resultDate: values.resultDate,
    })
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2 className="card__title">
        {isEdit ? `Edit Result #${result.id}` : 'Add Result'}
      </h2>

      <div className="form__fields">
        <div className="field">
          <label htmlFor="result-student-id">Student ID</label>
          <input
            id="result-student-id"
            name="studentId"
            type="number"
            min="1"
            step="1"
            value={values.studentId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="result-assignment-id">Assignment ID</label>
          <input
            id="result-assignment-id"
            name="assignmentId"
            type="number"
            min="1"
            step="1"
            value={values.assignmentId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="result-enrollment-id">Enrollment ID</label>
          <input
            id="result-enrollment-id"
            name="enrollmentId"
            type="number"
            min="1"
            step="1"
            value={values.enrollmentId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="result-marks">Marks</label>
          <input
            id="result-marks"
            name="marks"
            type="number"
            min="0"
            step="any"
            value={values.marks}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="result-grade">Grade</label>
          <input
            id="result-grade"
            name="grade"
            type="text"
            value={values.grade}
            onChange={handleChange}
            placeholder="e.g. A, B+, A1"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="result-date">Result Date</label>
          <input
            id="result-date"
            name="resultDate"
            type="date"
            value={values.resultDate}
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
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Result'}
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
