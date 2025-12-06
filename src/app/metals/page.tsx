import React from 'react'
import JsonLd from '@/components/JsonLd'
import MetalCalculator from '@/components/MetalCalculator'

export default async function MetalsPage({ searchParams }: { searchParams?: { [key:string]: string | string[] | undefined } }){
  const mode = (typeof searchParams?.mode === 'string' ? searchParams!.mode : 'cfd') === 'spot' ? 'spot' : 'cfd'
  const m = mode === 'cfd' ? 2 : 1

  const [r1, r2] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/spot/silver`, { cache:'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/spot/platinum`, { cache:'no-store' })
  ])
  const d1 = await r1.json()
  const d2 = await r2.json()
  const silver: number | null = d1 && d1.price ? d1.price : null
  const platinum: number | null = d2 && d2.price ? d2.price : null

  return (
    <div className="container py-5">
      <JsonLd type="metals" />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url: '/' }, { name:'Silver & Platinum', url: '/metals' } ] }} />
      <h1 className="text-center mb-4">Silver & Platinum</h1>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-primary text-white"><h2 className="h5 mb-0">What is silver’s price today?</h2></div>
            <div className="card-body text-center">
              <div className="display-4">{silver!=null? `$${(silver*m).toFixed(2)}` : 'Loading...'}</div>
              <p className="text-muted">USD/oz</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-secondary text-white"><h2 className="h5 mb-0">What is platinum’s price today?</h2></div>
            <div className="card-body text-center">
              <div className="display-4">{platinum!=null? `$${(platinum*m).toFixed(2)}` : 'Loading...'}</div>
              <p className="text-muted">USD/oz</p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <div className="btn-group btn-group-sm" role="group" aria-label="Display mode">
          <a className={`btn btn-outline-secondary${mode==='spot'?' active':''}`} href="/metals?mode=spot" aria-pressed={mode==='spot'}>Spot View</a>
          <a className={`btn btn-outline-secondary${mode==='cfd'?' active':''}`} href="/metals?mode=cfd" aria-pressed={mode==='cfd'}>CFD View</a>
        </div>
      </div>
      <div className="row g-4 mt-4">
        <div className="col-12 col-lg-6">
          <MetalCalculator metal="silver" />
        </div>
        <div className="col-12 col-lg-6">
          <MetalCalculator metal="platinum" />
        </div>
      </div>
      <div className="alert alert-info mt-4" role="alert">Looking for coin-specific melt values? Visit <a href="/coin-melt-values" className="alert-link">Coin Melt Values</a>.</div>
    </div>
  )
}
