import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { Auth } from '../Auth';
import { ItemsList } from '../ItemsList';
import { LogOut, Layout, User } from 'lucide-react';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch((err) => {
      console.error('Session init error:', err);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = () => supabase.auth.signOut();

  if (loading) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {session && (
        <header style={{ 
          padding: '1rem 2rem', 
          borderBottom: '1px solid var(--card-border)',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              background: 'var(--accent-gradient)', 
              padding: '0.5rem', 
              borderRadius: '0.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Layout size={20} color="white" />
            </div>
            <span style={{ fontWeight: 700, letterSpacing: '-0.025em' }}>CICD.INFRA</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <User size={16} />
              {session.user.email}
            </div>
            <button 
              onClick={handleLogout}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                background: 'rgba(255, 255, 255, 0.05)', 
                color: 'var(--text-primary)',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </header>
      )}

      <main style={{ flex: 1 }}>
        {!session ? <Auth /> : <ItemsList />}
      </main>

      <footer style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        color: 'var(--text-secondary)', 
        fontSize: '0.75rem',
        borderTop: '1px solid var(--card-border)',
        marginTop: 'auto'
      }}>
        Built with Express, PostgreSQL & Supabase Auth • CICD-Infra Professional Edition
      </footer>
    </div>
  );
}

export default App;