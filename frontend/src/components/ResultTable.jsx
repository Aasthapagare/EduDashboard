
export default function ResultTable({
  results,
  editingId,
  onEdit,
  onDelete,
}) {
  if (results.length === 0) {
    return <p className="state-message">No results found.</p>
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student ID</th>
            <th>Assignment ID</th>
            <th>Enrollment ID</th>
            <th>Marks</th>
            <th>Grade</th>
            <th>Result Date</th>
            <th className="data-table__actions-head">Actions</th>
          </tr>
        </thead>

        <tbody>
          {results.map((result) => (
            <tr
              key={result.id}
              className={result.id === editingId ? 'is-editing' : undefined}
            >
              <td data-label="ID">{result.id}</td>
              <td data-label="Student ID">{result.studentId}</td>
              <td data-label="Assignment ID">{result.assignmentId}</td>
              <td data-label="Enrollment ID">{result.enrollmentId}</td>
              <td data-label="Marks">{result.marks}</td>
              <td data-label="Grade">{result.grade}</td>
              <td data-label="Result Date">{result.resultDate || '—'}</td>
              <td data-label="Actions" className="data-table__actions">
                <button
                  type="button"
                  className="btn btn--small btn--secondary"
                  onClick={() => onEdit(result)}
                  aria-label={`Edit result ${result.id}`}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn btn--small btn--danger-outline"
                  onClick={() => onDelete(result)}
                  aria-label={`Delete result ${result.id}`}
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
