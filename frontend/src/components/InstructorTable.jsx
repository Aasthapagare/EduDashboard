
export default function InstructorTable({
  instructors,
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
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Specialization</th>
            <th scope="col" className="data-table__actions-head">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {instructors.map((instructor) => (
            <tr
              key={instructor.id}
              className={
                instructor.id === editingId ? 'is-editing' : undefined
              }
            >
              <td data-label="ID">{instructor.id}</td>
              <td data-label="Name">{instructor.name}</td>
              <td data-label="Email">{instructor.email}</td>
              <td data-label="Specialization">
                {instructor.specialization}
              </td>
              <td data-label="Actions" className="data-table__actions">
                <button
                  type="button"
                  className="btn btn--small btn--secondary"
                  onClick={() => onEdit(instructor)}
                  aria-label={`Edit ${instructor.name}`}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn btn--small btn--danger-outline"
                  onClick={() => onDelete(instructor)}
                  aria-label={`Delete ${instructor.name}`}
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
