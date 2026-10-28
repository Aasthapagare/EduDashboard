
import { useCallback, useEffect, useState } from 'react'
import Alert from '../components/Alert'
import ConfirmDialog from '../components/ConfirmDialog'
import ResultForm from '../components/ResultForm'
import ResultTable from '../components/ResultTable'
import { getErrorMessage } from '../services/api'
import {
  createResult,
  deleteResult,
  getResults,
  updateResult,
} from '../services/resultService'
import '../styles/students.css'

async function fetchResults() {
  try {
    const data = await getResults()

    if (!Array.isArray(data)) {
      return { error: 'Result Service returned an unexpected response.' }
    }

    return { data }
  } catch (error) {
    return {
      error: getErrorMessage(error, 'Unable to load results.'),
    }
  }
}

export default function Results() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formVersion, setFormVersion] = useState(0)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [searchId, setSearchId] = useState('')

  const applyResult = useCallback((response) => {
    if (response.error) {
      setLoadError(response.error)
    } else {
      setResults(response.data)
      setLoadError(null)
    }

    setLoading(false)
  }, [])

  const loadResults = useCallback(async () => {
    applyResult(await fetchResults())
  }, [applyResult])

  useEffect(() => {
    let active = true

    fetchResults().then((response) => {
      if (active) applyResult(response)
    })

    return () => {
      active = false
    }
  }, [applyResult])

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setNotice(null)

    try {
      if (editing) {
        await updateResult({
          id: editing.id,
          ...values,
        })

        setNotice({
          type: 'success',
          message: `Result #${editing.id} was updated.`,
        })

        setEditing(null)
      } else {
        const created = await createResult(values)

        setNotice({
          type: 'success',
          message: `Result was added${created?.id != null ? ` with ID ${created.id}` : ''}.`,
        })

        setFormVersion((version) => version + 1)
      }

      await loadResults()
    } catch (error) {
      setNotice({
        type: 'error',
        message: getErrorMessage(
          error,
          editing ? 'Unable to update result.' : 'Unable to add result.'
        ),
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!toDelete) return

    setDeleting(true)

    try {
      await deleteResult(toDelete.id)

      setNotice({
        type: 'success',
        message: `Result #${toDelete.id} was deleted.`,
      })

      if (editing?.id === toDelete.id) {
        setEditing(null)
      }

      setToDelete(null)
      await loadResults()
    } catch (error) {
      setNotice({
        type: 'error',
        message: getErrorMessage(error, 'Unable to delete result.'),
      })

      setToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  const filteredResults = searchId.trim() === ''
    ? results
    : results.filter(
        (result) => String(result.id) === searchId.trim()
      )

  const handleEdit = (result) => {
    setNotice(null)
    setEditing(result)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="page">
      <h1 className="page__title">Results</h1>

      {notice && (
        <Alert
          type={notice.type}
          onDismiss={() => setNotice(null)}
        >
          {notice.message}
        </Alert>
      )}

      <div className="students-layout">
        <ResultForm
          key={editing ? `edit-${editing.id}` : `add-${formVersion}`}
          result={editing}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />

        <div className="card">
          <div className="card__header">
            <h2 className="card__title">
              All Results
              {!loading && !loadError && ` (${filteredResults.length})`}
            </h2>

            <button
              type="button"
              className="btn btn--small btn--secondary"
              onClick={() => {
                setLoading(true)
                loadResults()
              }}
              disabled={loading}
            >
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>

          <div className="result-search">
            <label htmlFor="result-search-id">Search by Result ID</label>

            <div className="result-search__controls">
              <input
                id="result-search-id"
                type="number"
                min="1"
                step="1"
                value={searchId}
                onChange={(event) => setSearchId(event.target.value)}
                placeholder="Enter exact result ID"
              />

              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setSearchId('')}
              >
                Clear
              </button>
            </div>

            <p className="field__hint">
              Exact ID match only. Other fields are not searched.
            </p>
          </div>

          {loading && results.length === 0 && !loadError && (
            <p className="state-message">Loading results…</p>
          )}

          {loadError && (
            <Alert type="error">{loadError}</Alert>
          )}

          {!loading && !loadError && results.length === 0 && (
            <p className="state-message">
              No results found. Add the first result using the form.
            </p>
          )}

          {!loadError && results.length > 0 && filteredResults.length === 0 && (
            <p className="state-message">
              No result found with ID {searchId}.
            </p>
          )}

          {!loadError && filteredResults.length > 0 && (
            <ResultTable
              results={filteredResults}
              editingId={editing?.id}
              onEdit={handleEdit}
              onDelete={setToDelete}
            />
          )}
        </div>
      </div>

      {toDelete && (
        <ConfirmDialog
          title="Delete result"
          message={`Delete result #${toDelete.id}? This cannot be undone.`}
          confirmLabel="Delete"
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </section>
  )
}
