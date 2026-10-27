
export default function PaymentTable({
  payments,
  editingId,
  onEdit,
  onDelete,
}) {
  if (payments.length === 0) {
    return <p className="state-message">No payments found.</p>
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student ID</th>
            <th>Enrollment ID</th>
            <th>Amount (₹)</th>
            <th>Payment Date</th>
            <th>Status</th>
            <th className="data-table__actions-head">Actions</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => (
            <tr
              key={payment.id}
              className={payment.id === editingId ? 'is-editing' : undefined}
            >
              <td data-label="ID">{payment.id}</td>
              <td data-label="Student ID">{payment.studentId}</td>
              <td data-label="Enrollment ID">{payment.enrollmentId}</td>
              <td data-label="Amount">
                ₹{Number(payment.amount).toLocaleString('en-IN')}
              </td>
              <td data-label="Payment Date">
                {payment.paymentDate || '—'}
              </td>
              <td data-label="Status">{payment.status}</td>
              <td data-label="Actions" className="data-table__actions">
                <button
                  type="button"
                  className="btn btn--small btn--secondary"
                  onClick={() => onEdit(payment)}
                  aria-label={`Edit payment ${payment.id}`}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn btn--small btn--danger-outline"
                  onClick={() => onDelete(payment)}
                  aria-label={`Delete payment ${payment.id}`}
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
