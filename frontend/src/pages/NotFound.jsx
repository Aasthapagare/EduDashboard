import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="page">
      <h1 className="page__title">Page not found</h1>
      <div className="page__card">
        <p>
          The page you requested does not exist. <Link to="/">Return to the dashboard</Link>.
        </p>
      </div>
    </section>
  )
}
