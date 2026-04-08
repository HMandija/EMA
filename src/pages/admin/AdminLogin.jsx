import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

const ADMIN_DASHBOARD = (import.meta.env.VITE_ADMIN_PATH || "/ema-admin") + "/dashboard";
const RESET_EMAIL = "enm.architecture@gmail.com";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(ADMIN_DASHBOARD, { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(ADMIN_DASHBOARD, { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const target = email || RESET_EMAIL;
    try {
      await sendPasswordResetEmail(auth, target);
      setResetSent(true);
      setError("");
    } catch {
      setError("Could not send reset email. Check the email address.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <p className="text-white text-sm uppercase tracking-[0.4em] font-light">EMA</p>
          <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 mt-1">Architecture · Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b border-zinc-700 focus:border-white outline-none py-2 text-white text-sm transition-colors duration-300"
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full bg-transparent border-b border-zinc-700 focus:border-white outline-none py-2 text-white text-sm transition-colors duration-300"
            />
          </div>

          {error && <p className="text-red-400 text-[10px] tracking-wider">{error}</p>}
          {resetSent && (
            <p className="text-green-400 text-[10px] tracking-wider">
              ✓ Reset email sent to {email || RESET_EMAIL} — check your inbox.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-white text-white py-3 text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-40"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full text-zinc-600 text-[9px] uppercase tracking-wider hover:text-zinc-400 transition-colors pt-1"
          >
            Forgot password? Send reset email →
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
