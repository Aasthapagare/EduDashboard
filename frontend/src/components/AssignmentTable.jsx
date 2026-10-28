
export default function AssignmentTable({
  assignments,
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
            <th>Title</th>
            <th>Description</th>
            <th>Course ID</th>
            <th>Instructor ID</th>
            <th>Due Date</th>
            <th className="data-table__actions-head">Actions</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((assignment) => (
            <tr
              key={assignment.id}
              className={assignment.id === editingId ? 'is-editing' : undefined}
            >
              <td data-label="ID">{assignment.id}</td>
              <td data-label="Title">{assignment.title}</td>
              <td data-label="Description">{assignment.description}</td>
              <td data-label="Course ID">{assignment.courseId}</td>
              <td data-label="Instructor ID">{assignment.instructorId}</td>
              <td data-label="Due Date">{assignment.dueDate || '—'}</td>
              <td data-label="Actions" className="data-table__actions">
                <button
                  type="button"
                  className="btn btn--small btn--secondary"
                  onClick={() => onEdit(assignment)}
                  aria-label={`Edit assignment ${assignment.id}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn--small btn--danger-outline"
                  onClick={() => onDelete(assignment)}
                  aria-label={`Delete assignment ${assignment.id}`}
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
