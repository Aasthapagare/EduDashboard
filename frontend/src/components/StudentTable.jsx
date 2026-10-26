export default function StudentTable({ students, editingId, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Mobile</th>
            <th scope="col" className="data-table__actions-head">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className={student.id === editingId ? 'is-editing' : undefined}>
              <td data-label="ID">{student.id}</td>
              <td data-label="Name">{student.name}</td>
              <td data-label="Email">{student.email}</td>
              <td data-label="Mobile">{student.mobile}</td>
              <td data-label="Actions" className="data-table__actions">
                <button
                  type="button"
                  className="btn btn--small btn--secondary"
                  onClick={() => onEdit(student)}
                  aria-label={`Edit ${student.name}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn--small btn--danger-outline"
                  onClick={() => onDelete(student)}
                  aria-label={`Delete ${student.name}`}
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
