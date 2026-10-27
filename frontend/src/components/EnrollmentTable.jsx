
export default function EnrollmentTable({
  enrollments,
  editingId,
  onEdit,
  onDelete,
}) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Student ID</th>
            <th scope="col">Course ID</th>
            <th scope="col">Enrollment Date</th>
            <th scope="col">Status</th>
            <th scope="col" className="data-table__actions-head">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {enrollments.map((enrollment) => (
            <tr
              key={enrollment.id}
              className={
                enrollment.id === editingId ? 'is-editing' : undefined
              }
            >
              <td data-label="ID">{enrollment.id}</td>
              <td data-label="Student ID">{enrollment.studentId}</td>
              <td data-label="Course ID">{enrollment.courseId}</td>
              <td data-label="Enrollment Date">
                {enrollment.enrollmentDate || '—'}
              </td>
              <td data-label="Status">{enrollment.status}</td>
              <td data-label="Actions" className="data-table__actions">
                <button
                  type="button"
                  className="btn btn--small btn--secondary"
                  onClick={() => onEdit(enrollment)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn btn--small btn--danger-outline"
                  onClick={() => onDelete(enrollment)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
