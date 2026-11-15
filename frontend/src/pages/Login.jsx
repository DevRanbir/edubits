import { useState } from "react";
import { useAuth } from "../context/authValue";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/toastValue";
import { Loader, ArrowRight, Sparkles } from "lucide-react";
import { GoogleIcon, GitHubIcon } from "../features/homepage/BrandIcons";
import { API_URL } from "../config/api";
import "./login.css";

const handleOAuthLogin = (provider) => {
  window.location.href = `${API_URL}/auth/${provider}`;
};

export default function Login() {
  const navigate = useNavigate();
  const { login, tempLogin } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast("Please enter your email and password", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Login failed", "error");
        return;
      }

      login(data);
      navigate("/resources");
    } catch {
      showToast("Could not reach the server. Is it running?", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-left" aria-label="Edubits resources">
        <Link to="/" className="auth-left-brand">
          <img src="/images/favicon.png" alt="Edubits logo" width="40" height="40" className="auth-logo" />
          <span>Edubits</span>
        </Link>

        <div className="auth-left-copy">
          <h2>Let's make Engineering <span>easier.</span></h2>
          <p>Get PYQs, Notes, Playlists, Sgpa Calculator &amp; more...</p>
        </div>

        <figure className="auth-resource-preview">
          <img src="/images/homepage/Resources.png" alt="Preview of Edubits study resources organized by year" />
        </figure>
      </section>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h1>Welcome back</h1>
            <p>Log in to continue your learning journey</p>
          </div>

          <div className="auth-oauth-buttons">
            <button
              type="button"
              className="btn btn-secondary auth-oauth-btn auth-oauth-btn--google"
              onClick={() => handleOAuthLogin("google")}
            >
              <GoogleIcon /> Continue with Google
            </button>
            <button
              type="button"
              className="btn btn-secondary auth-oauth-btn auth-oauth-btn--github"
              onClick={() => handleOAuthLogin("github")}
            >
              <GitHubIcon /> Continue with GitHub
            </button>
          </div>

          <p style={{ fontSize: "11px", color: "var(--text-tertiary, #888)", textAlign: "center", margin: "-4px 0 12px" }}>
            (OAuth callback redirects to hosted site; use Email / Password or 1-Click Demo on localhost)
          </p>

          <div className="auth-divider">or</div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Email</label>
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>Password</label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", margin: "-6px 0 10px" }}>
              <button
                type="button"
                onClick={() => {
                  setEmail("demo@edubits.io");
                  setPassword("Password12345!");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary, #6366f1)",
                  fontSize: "12px",
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                Auto-fill Demo Credentials
              </button>
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <Loader size={16} className="spin-icon" />
                  Waking server...
                </span>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <div style={{ margin: "16px 0 10px", textAlign: "center" }}>
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  const loggedUser = await tempLogin("user");
                  if (loggedUser) {
                    showToast(`Logged in as ${loggedUser.name || loggedUser.email}`, "success");
                    navigate("/resources");
                  } else {
                    showToast("Could not complete instant login", "error");
                  }
                } finally {
                  setLoading(false);
                }
              }}
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px dashed rgba(62, 155, 143, 0.6)",
                background: "rgba(62, 155, 143, 0.08)",
                color: "var(--primary, #3e9b8f)",
                fontWeight: 600,
                fontSize: "13.5px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              <Sparkles size={16} /> Instant 1-Click Login (Live Demo Account)
            </button>
          </div>

          <p className="auth-footer">
            New to Edubits?
            <Link to="/register">
              Create account <ArrowRight size={14} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
