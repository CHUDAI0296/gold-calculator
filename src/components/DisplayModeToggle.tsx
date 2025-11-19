"use client";
import React from 'react';

export default function DisplayModeToggle(){
  const setMode = (m: 'spot'|'cfd') => {
    try { localStorage.setItem('price_display_mode', m) } catch {}
    try { window.dispatchEvent(new CustomEvent('price_display_mode_change', { detail: m })) } catch {}
  }
  return (
    <div className="btn-group" role="group" aria-label="Display mode">
      <button className="btn btn-outline-secondary btn-sm" onClick={()=>setMode('spot')}>Spot View</button>
      <button className="btn btn-outline-secondary btn-sm" onClick={()=>setMode('cfd')}>CFD View</button>
    </div>
  )
}