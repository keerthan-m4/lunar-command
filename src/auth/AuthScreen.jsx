import { useState } from "react";
import "./auth.css";

export default function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async event => {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    const { supabase } = await import("./supabase");
    try {
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({ email: email.trim(), password });
        if (authError) throw authError;
        if (data.session) setMessage("Account created. Opening your mission…");
        else setMessage("Account created. Check your email to confirm your account, then log in.");
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    if (!email.trim()) { setError("Enter your email first."); return; }
    setError(""); setMessage("");
    const { supabase } = await import("./supabase");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin
    });
    if (resetError) setError(resetError.message);
    else setMessage("Password reset link sent. Check your inbox.");
  };

  return (
    <main className="auth-page">
      <div className="auth-orbit orbit-one" /><div className="auth-orbit orbit-two" />
      <section className="auth-card">
        <div className="auth-logo">LC</div>
        <p className="auth-kicker">LUNAR SOUTH POLE · MISSION CONTROL</p>
        <h1>{mode === "login" ? "Welcome back, Commander." : "Create your mission account."}</h1>
        <p className="auth-subtitle">Sign in to access your lunar survival simulation.</p>
        <div className="auth-tabs">
          <button className={mode === "login" ? "selected" : ""} onClick={() => {setMode("login");setError("");setMessage("");}}>LOG IN</button>
          <button className={mode === "signup" ? "selected" : ""} onClick={() => {setMode("signup");setError("");setMessage("");}}>CREATE ACCOUNT</button>
        </div>
        <form onSubmit={submit}>
          <label>Email address</label>
          <input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="commander@example.com" />
          <label>Password</label>
          <input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" />
          {mode === "login" && <button type="button" className="auth-forgot" onClick={resetPassword}>Forgot password?</button>}
          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-message" role="status">{message}</p>}
          <button className="auth-submit" disabled={busy}>{busy ? "PLEASE WAIT…" : mode === "login" ? "ENTER MISSION CONTROL" : "CREATE ACCOUNT"}</button>
        </form>
        <p className="auth-footnote">Secure authentication powered by Supabase. Never share your password.</p>
      </section>
    </main>
  );
}
