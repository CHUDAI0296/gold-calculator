'use client'
import { useEffect, useRef } from 'react'

export default function AdBanner() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    
    // Clear container to prevent duplicate ads on re-renders
    containerRef.current.innerHTML = ''

    const conf = document.createElement('script')
    conf.type = 'text/javascript'
    conf.text = `
      atOptions = { 
        'key' : '80b1ac323b9d18a8f858226d88590072', 
        'format' : 'iframe', 
        'height' : 90, 
        'width' : 728, 
        'params' : {} 
      };
    `
    
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = "https://www.highperformanceformat.com/80b1ac323b9d18a8f858226d88590072/invoke.js"

    containerRef.current.appendChild(conf)
    containerRef.current.appendChild(script)
  }, [])

  return (
    <div className="d-flex justify-content-center my-4" style={{ overflow: 'hidden' }}>
      <div ref={containerRef} />
    </div>
  )
}
