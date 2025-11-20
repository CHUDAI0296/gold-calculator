import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Script from 'next/script';
import GoogleAnalytics from './GoogleAnalytics';
import JsonLd from '@/components/JsonLd'

// 导入样式
import '@/app/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gold Calculator - Calculate Gold Value Instantly',
  description: 'Calculate the value of your gold with our easy-to-use gold calculator. Get real-time gold prices and accurate estimations.',
  metadataBase: new URL('https://www.goldcalculator.click')
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://s3.tradingview.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="//s3.tradingview.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/favicon.svg" />
        {/* manifest removed to avoid 404 in dev */}
        <link rel="preload" as="style" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          media="print"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <GoogleAnalytics />
        <JsonLd type="organization" />
        <Navigation />
        <main>{children}</main>
        <footer className="bg-dark text-light mt-5">
          <div className="container py-4">
            <div className="row">
              <div className="col-md-4 mb-3">
                <h2 className="h6">Gold Calculator</h2>
                <p className="small text-muted">Calculate gold value instantly with live prices.</p>
              </div>
              <div className="col-md-4 mb-3">
                <h2 className="h6">Explore</h2>
                <ul className="list-unstyled small">
                  <li><a href="/calculator" className="link-light">Calculator</a></li>
                  <li><a href="/market" className="link-light">Market</a></li>
                  <li><a href="/metals" className="link-light">Metals</a></li>
                  <li><a href="/news" className="link-light">News</a></li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <h2 className="h6">About</h2>
                <ul className="list-unstyled small">
                  <li><a href="/about" className="link-light">About</a></li>
                  <li><a href="/contact" className="link-light">Contact</a></li>
                  <li><a href="/faq" className="link-light">FAQ</a></li>
                  <li><a href="/privacy" className="link-light">Privacy</a></li>
                </ul>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <div className="d-flex align-items-center gap-3">
                  <span className="small text-muted">Follow us</span>
                  <a href="https://twitter.com/goldcalculator" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-light fs-5">
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                  <a href="https://www.linkedin.com/company/goldcalculator" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-light fs-5">
                    <i className="fa-brands fa-linkedin"></i>
                  </a>
                  <a href="https://www.youtube.com/@goldcalculator" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-light fs-5">
                    <i className="fa-brands fa-youtube"></i>
                  </a>
                  <a href="https://www.reddit.com/r/gold/" target="_blank" rel="noopener noreferrer" aria-label="Reddit" className="text-light fs-5">
                    <i className="fa-brands fa-reddit"></i>
                  </a>
                  <a href="https://www.facebook.com/goldcalculator" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-light fs-5">
                    <i className="fa-brands fa-facebook"></i>
                  </a>
                  <a href="https://www.instagram.com/goldcalculator" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-light fs-5">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-top border-secondary pt-3 small text-muted d-flex justify-content-between">
              <span>© {new Date().getFullYear()} Gold Calculator. All rights reserved.</span>
              <span>Data for information only; not investment advice.</span>
            </div>
          </div>
        </footer>

        <button
          type="button"
          className="btn btn-warning rounded-circle position-fixed"
          style={{ bottom: 20, right: 20, zIndex: 1030, width: 56, height: 56 }}
          data-bs-toggle="modal"
          data-bs-target="#aiAdvisorModal"
          aria-label="Ask AI"
          title="Ask AI"
        >
          <i className="fa-solid fa-robot"></i>
        </button>

        <div className="modal fade" id="aiAdvisorModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="h5 modal-title">AI Advisor</h2>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p className="mb-3">Ask questions about gold price, 18K per gram, selling quotes, or market trends.</p>
                <div className="mb-3">
                  <textarea id="aiPrompt" className="form-control" rows={3} placeholder="e.g. How much is 18K gold per gram?" />
                </div>
                <div className="d-flex gap-2">
                  <button id="aiSendBtn" type="button" className="btn btn-warning">Ask AI</button>
                  <a href="/calculator" className="btn btn-outline-warning">Calculator</a>
                  <a href="/market" className="btn btn-primary">Market</a>
                  <a href="/faq" className="btn btn-outline-secondary">FAQ</a>
                </div>
                <pre id="aiOutput" className="mt-3 small bg-dark text-light p-2" style={{ minHeight: 120 }}></pre>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        <Script id="fa-unblock" strategy="afterInteractive">
          {`
            try{ var l = document.querySelector('link[href*="font-awesome"][rel="stylesheet"]'); if(l) l.media='all'; }catch{}
          `}
        </Script>
        <Script id="sw-kill" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(function(rs){
                rs.forEach(function(r){ r.unregister(); });
              }).catch(function(){});
            }
          `}
        </Script>
        <Script id="ai-advisor-client" strategy="afterInteractive">
          {`
            (function(){
              var btn = document.getElementById('aiSendBtn');
              var input = document.getElementById('aiPrompt');
              var out = document.getElementById('aiOutput');
              if(!btn || !input || !out) return;
              var sending = false;
              btn.addEventListener('click', async function(){
                if(sending) return; sending = true; btn.disabled = true; out.textContent='';
                var prompt = (input.value||'').trim();
                var ctx = '';
                try{
                  var form = document.getElementById('goldCalculator');
                  if(form){
                    var w = document.getElementById('weight');
                    var u = document.getElementById('weightUnit');
                    var k = document.getElementById('karat');
                    var p = document.getElementById('premium');
                    var resEl = document.querySelector('.result-display .display-4');
                    var ww = w && w.value ? w.value : '';
                    var uu = u && u.value ? u.value : '';
                    var kk = k && k.value ? k.value : '';
                    var pp = p && p.value ? p.value : '';
                    var rr = resEl && resEl.textContent ? resEl.textContent.trim() : '';
                    ctx = 'Context: weight='+ww+(uu?(' '+uu):'')+', karat='+kk+'K, premium='+pp+'%, estimated='+rr;
                  }
                  // News & Market context
                  var path = location && location.pathname ? location.pathname : '';
                  if(!ctx && path){
                    if(path.startsWith('/news')){
                      try{
                        var q = new URLSearchParams(location.search).get('q');
                        if(q) ctx = 'Context: news topic="'+q+'"'; else ctx = 'Context: news page';
                      }catch{}
                    } else if(path.startsWith('/market')){
                      var ctxEl = document.getElementById('ai-market-context');
                      if(ctxEl){
                        var md = ctxEl.getAttribute('data-mode')||'';
                        var rsi = ctxEl.getAttribute('data-rsi')||'';
                        var macd = ctxEl.getAttribute('data-macd')||'';
                        var sig = ctxEl.getAttribute('data-signal')||'';
                        var hist = ctxEl.getAttribute('data-hist')||'';
                        var ma = ctxEl.getAttribute('data-ma')||'';
                        ctx = 'Context: market mode='+md+'; rsi='+rsi+'; macd='+macd+' / signal='+sig+' (hist '+hist+'); ma='+ma;
                      } else {
                        ctx = 'Context: market page (charts & indicators)';
                      }
                    } else if(path.startsWith('/metals')){
                      ctx = 'Context: metals page (silver & platinum)';
                    }
                  }
                }catch(e){}
                if(!prompt){ out.textContent='Please enter a question.'; btn.disabled=false; sending=false; return; }
                try{
                  var finalPrompt = ctx ? (prompt+'\n'+ctx) : prompt;
                  var resp = await fetch('/api/ai', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt: finalPrompt, max_tokens: 4096 }) });
                  if(!resp.ok){ var txt = ''; try{ txt = await resp.text(); }catch{}; out.textContent = txt || ('HTTP '+resp.status); btn.disabled=false; sending=false; return; }
                  if(!resp.body){ try{ out.textContent = await resp.text(); }catch{ out.textContent='No response'; } btn.disabled=false; sending=false; return; }
                  var reader = resp.body.getReader(); var decoder = new TextDecoder();
                  while(true){
                    var r = await reader.read(); if(r.done) break; out.textContent += decoder.decode(r.value, { stream:true });
                  }
                }catch(e){ out.textContent='Error: '+(e && e.message ? e.message : 'failed'); }
                btn.disabled=false; sending=false;
              });
            })();
          `}
        </Script>
        {/* Ad script removed per request */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
