"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

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

  const sendLink = () => {
    setSending(true);
    supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + '/holdings' : undefined }
    }).finally(() => setSending(false));
  };

  const signInPassword = async () => {
    setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setErr(error.message || "Sign in failed"); return; }
  };

  return (
    <div className="container py-5">
      <JsonLd type="webpage" />
      <JsonLd type="breadcrumbs" data={{ items: [ { name:"Home", url:"/" }, { name:"Sign In", url:"/login" } ] }} />
      <h1 className="text-center mb-4">Sign In</h1>

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
                <input type="email" className="form-control" placeholder="Enter email to sign in" value={email} onChange={e=>setEmail(e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" placeholder="Enter password" value={password} onChange={e=>setPassword(e.target.value)} />
              </div>
              <div className="col-md-3">
                <button type="button" className="btn btn-primary w-100" disabled={!email || !password} onClick={signInPassword}>Sign In</button>
              </div>
              <div className="col-md-3">
                <button type="button" className="btn btn-outline-secondary w-100" disabled={sending || !email} onClick={sendLink}>Send magic link</button>
              </div>
            </div>
            <div className="mt-3">
              <small className="text-muted">After signing in, you will be redirected to Holdings.</small>
              {err && <div className="text-danger mt-2">{err}</div>}
              <div className="mt-2">
                <Link href={`/signup${email?`?email=${encodeURIComponent(email)}`:''}`}>Create an account</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
