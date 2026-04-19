export default function Home() {
  return (
    <div className="container" style={{ marginTop: '6rem' }}>
      <section className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Find Your Next Run</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Discover local running events, join clubs, and connect with the vibrant running community in your city.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <input 
            type="text" 
            placeholder="Search events or clubs..." 
            className="glass-panel"
            style={{ padding: '0.75rem 1rem', width: '300px', color: 'white' }}
          />
          <button className="btn-primary">Search</button>
        </div>
      </section>
      
      <div className="glass-panel animate-fade-up" style={{ marginTop: '4rem', padding: '3rem', textAlign: 'center', animationDelay: '0.2s' }}>
        <h3>Explore Our Core Features</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '2rem' }}>
          Discover what's happening around you.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/clubs" className="btn-primary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none' }}>Browse Clubs</a>
          <a href="/events" className="btn-primary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none' }}>View Events</a>
        </div>
      </div>
    </div>
  );
}
