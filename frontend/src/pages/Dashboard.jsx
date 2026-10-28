
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createApiClient } from '../services/api'

const services = [
  {
    key: 'students',
    title: 'Total Students',
    path: '/students',
    baseURL: import.meta.env.VITE_STUDENT_SERVICE_URL || '/api/student-service',
    icon: '♟',
    color: '#facc15',
    link: '/students',
  },
  {
    key: 'courses',
    title: 'Total Courses',
    path: '/courses',
    baseURL: import.meta.env.VITE_COURSE_SERVICE_URL || '/api/course-service',
    icon: '▤',
    color: '#60a5fa',
    link: '/courses',
  },
  {
    key: 'instructors',
    title: 'Total Instructors',
    path: '/instructors',
    baseURL: import.meta.env.VITE_INSTRUCTOR_SERVICE_URL || '/api/instructor-service',
    icon: '♙',
    color: '#c084fc',
    link: '/instructors',
  },
  {
    key: 'enrollments',
    title: 'Total Enrollments',
    path: '/enrollments',
    baseURL: import.meta.env.VITE_ENROLLMENT_SERVICE_URL || '/api/enrollment-service',
    icon: '▣',
    color: '#34d399',
    link: '/enrollments',
  },
  {
    key: 'payments',
    title: 'Total Payments',
    path: '/payments',
    baseURL: import.meta.env.VITE_PAYMENT_SERVICE_URL || '/api/payment-service',
    icon: '₹',
    color: '#fb923c',
    link: '/payments',
  },
  {
    key: 'assignments',
    title: 'Total Assignments',
    path: '/assignments',
    baseURL: import.meta.env.VITE_ASSIGNMENT_SERVICE_URL || '/api/assignment-service',
    icon: '✎',
    color: '#f472b6',
    link: '/assignments',
  },
  {
    key: 'results',
    title: 'Total Results',
    path: '/results',
    baseURL: import.meta.env.VITE_RESULT_SERVICE_URL || '/api/result-service',
    icon: '✓',
    color: '#2dd4bf',
    link: '/results',
  },
]

const initialCounts = Object.fromEntries(
  services.map((service) => [service.key, null])
)

export default function Dashboard() {
  const [counts, setCounts] = useState(initialCounts)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true)

    const results = await Promise.allSettled(
      services.map(async (service) => {
        const client = createApiClient(service.baseURL)
        const { data } = await client.get(service.path)

        if (!Array.isArray(data)) {
          throw new Error('Unexpected response from service.')
        }

        return { key: service.key, count: data.length }
      })
    )

    const nextCounts = {}
    const nextErrors = {}

    results.forEach((result, index) => {
      const key = services[index].key

      if (result.status === 'fulfilled') {
        nextCounts[key] = result.value.count
      } else {
        nextErrors[key] = 'Unable to load. Check whether this service is running.'
      }
    })

    setCounts(nextCounts)
    setErrors(nextErrors)
    setLastUpdated(new Date())
    setLoading(false)
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const successfulCount = services.filter(
    (service) => counts[service.key] !== null && counts[service.key] !== undefined
  ).length

  return (
    <section className="page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 className="page__title">Dashboard</h1>
          <p style={{ color: 'var(--text-muted, #9ca3af)', marginTop: '8px' }}>
            Overview of your Online Learning Platform
          </p>
        </div>

        <button
          type="button"
          className="btn btn--secondary"
          onClick={loadDashboard}
          disabled={loading}
        >
          {loading ? 'Refreshing…' : '↻ Refresh Data'}
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '18px',
        }}
      >
        {services.map((service) => (
          <Link
            to={service.link}
            key={service.key}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
            }}
          >
            <article
              className="card"
              style={{
                padding: '22px',
                borderTop: `3px solid ${service.color}`,
                height: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <span style={{ color: 'var(--text-muted, #9ca3af)', fontSize: '14px' }}>
                  {service.title}
                </span>

                <span
                  aria-hidden="true"
                  style={{
                    color: service.color,
                    fontSize: '25px',
                    fontWeight: 'bold',
                  }}
                >
                  {service.icon}
                </span>
              </div>

              <div
                style={{
                  fontSize: '34px',
                  fontWeight: 700,
                  marginTop: '18px',
                  color: service.color,
                }}
              >
                {loading && counts[service.key] === null
                  ? '…'
                  : counts[service.key] ?? '—'}
              </div>

              {errors[service.key] ? (
                <p
                  role="status"
                  style={{
                    color: '#f87171',
                    fontSize: '12px',
                    marginTop: '12px',
                  }}
                >
                  {errors[service.key]}
                </p>
              ) : (
                <p
                  style={{
                    color: 'var(--text-muted, #9ca3af)',
                    fontSize: '12px',
                    marginTop: '12px',
                  }}
                >
                  View records →
                </p>
              )}
            </article>
          </Link>
        ))}
      </div>

      <div className="card" style={{ marginTop: '24px', padding: '20px' }}>
        <h2 className="card__title">Service Overview</h2>

        <p style={{ marginTop: '12px', lineHeight: 1.7 }}>
          {loading
            ? 'Loading data from backend services…'
            : `${successfulCount} of ${services.length} services responded successfully.`}
        </p>

        {Object.keys(errors).length > 0 && (
          <p style={{ color: '#f87171', marginTop: '8px', fontSize: '14px' }}>
            Some counts could not be loaded. Check the corresponding backend services
            and refresh the dashboard.
          </p>
        )}

        {lastUpdated && !loading && (
          <p
            style={{
              color: 'var(--text-muted, #9ca3af)',
              fontSize: '12px',
              marginTop: '10px',
            }}
          >
            Last checked: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>
    </section>
  )
}
