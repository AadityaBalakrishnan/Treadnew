import './globals.css';

export const metadata = {
  title: 'Community Running Platform',
  description: 'Join local runs, create clubs, and manage events.',
};

import Provider from "./Provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <nav className="glass-panel" style={{ padding: '1rem', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, position: 'sticky', top: 0, zIndex: 50 }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="logo" style={{ margin: 0 }}>🏃 Running Platform</h2>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <a href="/events">Events</a>
                <a href="/clubs">Clubs</a>
                <a href="/create-event">Create Event</a>
                <button className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Sign In</button>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
