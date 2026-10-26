export default function PlaceholderPage({ title }) {
  return (
    <section className="page">
      <h1 className="page__title">{title}</h1>
      <div className="page__card">
        <p>The {title} page will be implemented later.</p>
      </div>
    </section>
  )
}
