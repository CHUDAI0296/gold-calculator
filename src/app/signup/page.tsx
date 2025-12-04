"use client";
import React, { Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SignUpContent() {
  const params = useSearchParams();
  const preEmail = params.get('email') || '';
  const [email, setEmail] = useState(preEmail);
  const [password, setPassword] = useState("");
  const [uid, setUid] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user || null;
      setUid(u?.id || null);
      setUserEmail(u?.email || "");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null;
      setUid(u?.id || null);
      setUserEmail(u?.email || "");
    });
    return () => { sub?.subscription.unsubscribe(); };
  }, []);

  const signUp = async () => {
    setErr("");
    setMsg("");
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + '/holdings' : undefined }
    });
    if (error) { setErr(error.message || "Sign up failed"); return; }
    if (data?.user) { setMsg("Check your email to confirm sign-up."); }
  };

  return (
    <div className="container py-5">
      <JsonLd type="webpage" />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:"Home", url:"/" }, { name:"Sign Up", url:"/signup" } ] }} />
      <h1 className="text-center mb-4">Sign Up</h1>

      {uid ? (
        <div className="card">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div>Signed in as {userEmail}</div>
            <div>
              <Link href="/holdings" className="btn btn-primary me-2">Go to Holdings</Link>
              <button className="btn btn-outline-secondary" onClick={()=>supabase.auth.signOut()}>Sign out</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={e=>setEmail(e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" placeholder="Enter password" value={password} onChange={e=>setPassword(e.target.value)} />
              </div>
              <div className="col-md-3">
                <button type="button" className="btn btn-primary w-100" disabled={!email || !password} onClick={signUp}>Sign Up</button>
              </div>
              <div className="col-md-3">
                <Link href={`/login${email?`?email=${encodeURIComponent(email)}`:''}`} className="btn btn-outline-secondary w-100">Back to Sign In</Link>
              </div>
            </div>
            <div className="mt-3">
              <small className="text-muted">After confirming via email, you will be redirected to Holdings.</small>
              {msg && <div className="text-success mt-2">{msg}</div>}
              {err && <div className="text-danger mt-2">{err}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="container py-5"><h1 className="text-center mb-4">Sign Up</h1></div>}>
      <SignUpContent />
    </Suspense>
  );
}
