;(function(){
  var btn = document.getElementById('aiSendBtn')
  var input = document.getElementById('aiPrompt')
  var out = document.getElementById('aiOutput')
  if(!btn || !input || !out) return
  var sending = false
  btn.addEventListener('click', async function(){
    if(sending) return; sending = true; btn.disabled = true; out.textContent=''
    var prompt = (input.value||'').trim()
    var ctx = ''
    try{
      var form = document.getElementById('goldCalculator')
      if(form){
        var w = document.getElementById('weight')
        var u = document.getElementById('weightUnit')
        var k = document.getElementById('karat')
        var p = document.getElementById('premium')
        var resEl = document.querySelector('.result-display .display-4')
        var ww = w && w.value ? w.value : ''
        var uu = u && u.value ? u.value : ''
        var kk = k && k.value ? k.value : ''
        var pp = p && p.value ? p.value : ''
        var rr = resEl && resEl.textContent ? resEl.textContent.trim() : ''
        ctx = 'Context: weight='+ww+(uu?(' '+uu):'')+', karat='+kk+'K, premium='+pp+'%, estimated='+rr
      }
      var path = location && location.pathname ? location.pathname : ''
      if(!ctx && path){
        if(path.startsWith('/news')){
          try{
            var q = new URLSearchParams(location.search).get('q')
            if(q) ctx = 'Context: news topic="'+q+'"'; else ctx = 'Context: news page'
          }catch{}
        } else if(path.startsWith('/market')){
          var ctxEl = document.getElementById('ai-market-context')
          if(ctxEl){
            var md = ctxEl.getAttribute('data-mode')||''
            var rsi = ctxEl.getAttribute('data-rsi')||''
            var macd = ctxEl.getAttribute('data-macd')||''
            var sig = ctxEl.getAttribute('data-signal')||''
            var hist = ctxEl.getAttribute('data-hist')||''
            var ma = ctxEl.getAttribute('data-ma')||''
            ctx = 'Context: market mode='+md+'; rsi='+rsi+'; macd='+macd+' / signal='+sig+' (hist '+hist+'); ma='+ma
          } else {
            ctx = 'Context: market page (charts & indicators)'
          }
        } else if(path.startsWith('/metals')){
          ctx = 'Context: metals page (silver & platinum)'
        }
      }
    }catch(e){}
    if(!prompt){ out.textContent='Please enter a question.'; btn.disabled=false; sending=false; return }
    try{
      var finalPrompt = ctx ? (prompt+'\n'+ctx) : prompt
      var resp = await fetch('/api/ai', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt: finalPrompt, max_tokens: 4096 }) })
      if(!resp.ok){ var txt = ''; try{ txt = await resp.text() }catch{}; out.textContent = txt || ('HTTP '+resp.status); btn.disabled=false; sending=false; return }
      if(!resp.body){ try{ out.textContent = await resp.text() }catch{ out.textContent='No response' }; btn.disabled=false; sending=false; return }
      var reader = resp.body.getReader(); var decoder = new TextDecoder()
      while(true){ var r = await reader.read(); if(r.done) break; out.textContent += decoder.decode(r.value, { stream:true }) }
    }catch(e){ out.textContent='Error: '+(e && e.message ? e.message : 'failed') }
    btn.disabled=false; sending=false
  })
})()