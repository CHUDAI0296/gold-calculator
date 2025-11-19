import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Privacy Policy – How We Handle Your Data',
  description: 'Summary of data collection, usage, and storage. We minimize tracking and avoid storing personal data where possible.',
  alternates: { canonical: 'https://www.goldcalculator.click/privacy' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
}

export default function Page(){
  return (
    <div className="container py-5">
      <JsonLd type="webpage" />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url:'/' }, { name:'Privacy Policy', url:'/privacy' } ] }} />
      <h1 className="text-center mb-4">Privacy Policy</h1>
      <div className="card">
        <div className="card-body">
          <h2 className="h5">Overview</h2>
          <p>We design Gold Calculator to work with minimal data. We do not require accounts and avoid storing personal information.</p>
          <h2 className="h5 mt-3">Data we collect</h2>
          <ul>
            <li>Anonymous usage metrics to improve performance and reliability.</li>
            <li>Technical logs for error diagnosis.</li>
          </ul>
          <h2 className="h5 mt-3">Cookies and analytics</h2>
          <p>We may use non‑intrusive analytics to understand aggregate usage. You can block analytics scripts via browser settings or extensions.</p>
          <h2 className="h5 mt-3">Data sharing</h2>
          <p>We do not sell personal data. Aggregated, anonymized statistics may be used internally.</p>
          <h2 className="h5 mt-3">Contact</h2>
          <p>For privacy questions, contact support@goldcalculator.click.</p>
        </div>
      </div>
    </div>
  )
}