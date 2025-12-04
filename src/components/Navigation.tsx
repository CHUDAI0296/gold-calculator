'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user || null;
      setUid(u?.id || null);
      setEmail(u?.email || '');
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null;
      setUid(u?.id || null);
      setEmail(u?.email || '');
    });
    return () => { sub?.subscription.unsubscribe(); };
  }, []);

  return (
    <header className="bg-dark text-white">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link href="/" className="navbar-brand">
            <i className="fas fa-coins gold-icon" aria-hidden="true"></i> <span suppressHydrationWarning>Gold Calculator</span>
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link href="/" className="nav-link">Home</Link></li>
              <li className="nav-item"><Link href="/calculator" className="nav-link">Calculator</Link></li>
              <li className="nav-item"><Link href="/market" className="nav-link">Market</Link></li>
              <li className="nav-item"><Link href="/metals" className="nav-link">Metals</Link></li>
              <li className="nav-item"><Link href="/holdings" className="nav-link">Holdings</Link></li>
              <li className="nav-item"><Link href="/news" className="nav-link">News</Link></li>
              <li className="nav-item"><Link href="/faq" className="nav-link">FAQ</Link></li>
              {uid ? (
                <li className="nav-item d-flex align-items-center ms-2">
                  <span className="nav-link">{email || 'Account'}</span>
                  <button className="btn btn-outline-light btn-sm ms-2" onClick={()=>supabase.auth.signOut()}>Sign Out</button>
                </li>
              ) : (
                <li className="nav-item"><Link href="/holdings" className="nav-link">Sign In</Link></li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
