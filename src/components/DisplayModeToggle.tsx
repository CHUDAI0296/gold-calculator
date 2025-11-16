"use client";
import React from 'react';

export default function DisplayModeToggle(){
  const setMode = (m: 'spot'|'cfd') => {
    try { localStorage.setItem('price_display_mode', m) } catch {}
    location.reload()
  }
  return (
    <div className="btn-group" role="group" aria-label="Display mode">
      <button className="btn btn-outline-secondary btn-sm" onClick={()=>setMode('spot')}>现货显示</button>
      <button className="btn btn-outline-secondary btn-sm" onClick={()=>setMode('cfd')}>CFD显示</button>
    </div>
  )
}