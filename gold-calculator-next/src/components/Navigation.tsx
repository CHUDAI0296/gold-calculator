'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-dark text-white">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link href="/" className="navbar-brand">
            <i className="fas fa-coins gold-icon"></i> Gold Calculator
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
              <li className="nav-item">
                <Link href="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link href="/calculator" className="nav-link">Gold Calculator</Link>
              </li>
              <li className="nav-item">
                <Link href="/metals" className="nav-link">Other Metals</Link>
              </li>
              <li className="nav-item">
                <Link href="/market" className="nav-link">Market Charts</Link>
              </li>
              <li className="nav-item">
                <Link href="/multi-calculator" className="nav-link">Batch Calculator</Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  Education
                </a>
                <ul className="dropdown-menu">
                  <li><Link href="/gold-education" className="dropdown-item">Gold Education</Link></li>
                  <li><Link href="/silver-guide" className="dropdown-item">Silver Guide</Link></li>
                  <li><Link href="/gold-history" className="dropdown-item">Gold History</Link></li>
                  <li><Link href="/investment-guide" className="dropdown-item">Investment Guide</Link></li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  Services
                </a>
                <ul className="dropdown-menu">
                  <li><Link href="/refining-services" className="dropdown-item">Refining Services</Link></li>
                  <li><Link href="/dealer-program" className="dropdown-item">Dealer Program</Link></li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  Pricing
                </a>
                <ul className="dropdown-menu">
                  <li><Link href="/coin-melt-values" className="dropdown-item">Coin Melt Values</Link></li>
                  <li><Link href="/live-karat-prices" className="dropdown-item">Live Karat Prices</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <Link href="/about" className="nav-link">About Us</Link>
              </li>
              <li className="nav-item">
                <Link href="/contact" className="nav-link">Contact</Link>
              </li>
              <li className="nav-item">
                <Link href="/sitemap" className="nav-link">Sitemap</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}