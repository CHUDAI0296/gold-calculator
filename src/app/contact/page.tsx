import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Contact Us – Get Support or Share Feedback',
  description: 'Questions or suggestions? Reach out to the Gold Calculator team for support and feedback.',
  alternates: { canonical: 'https://www.goldcalculator.click/contact' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
}

export default function Page(){
  return (
    <div className="container py-5">
      <JsonLd type="webpage" />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:'Home', url:'/' }, { name:'Contact', url:'/contact' } ] }} />
      <h1 className="text-center mb-4">Contact Us</h1>
      <div className="card">
        <div className="card-body">
          <p>We value your feedback. If you encounter issues or have ideas to improve the tools, please get in touch.</p>
          <ul>
            <li>Support requests and bug reports</li>
            <li>Feature suggestions and partnerships</li>
            <li>Media or research inquiries</li>
          </ul>
          <p className="mt-3">Preferred contact channels:</p>
          <ul>
            <li>Email: support@goldcalculator.click</li>
            <li>FAQ: <a href="/faq">Gold Calculator FAQ</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}