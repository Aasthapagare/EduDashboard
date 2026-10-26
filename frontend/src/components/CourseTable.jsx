
export default function CourseTable({
  courses,
  editingId,
  onEdit,
  onDelete,
}) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Course name</th>
            <th>Duration</th>
            <th>Fee</th>
            <th className="data-table__actions-head">Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((course) => (
            <tr
              key={course.id}
              className={
                course.id === editingId ? 'is-editing' : undefined
              }
            >
              <td data-label="ID">{course.id}</td>
              <td data-label="Course name">{course.coursename}</td>
              <td data-label="Duration">{course.duration}</td>
              <td data-label="Fee">
                ₹{Number(course.fee).toLocaleString('en-IN')}
              </td>

              <td data-label="Actions" className="data-table__actions">
                <button
                  type="button"
                  className="btn btn--small btn--secondary"
                  onClick={() => onEdit(course)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn btn--small btn--danger-outline"
                  onClick={() => onDelete(course)}
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
