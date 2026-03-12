import { FormEvent, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppState, useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { loginThunk } from "../../store/auth.actions";

export function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: AppState) => state.auth,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [needOtp, setNeedOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [backupCode, setBackupCode] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password || isLoading) return false;
    if (!needOtp) return true;
    return otpCode.trim().length > 0 || backupCode.trim().length > 0;
  }, [email, password, needOtp, otpCode, backupCode, isLoading]);

  if (isAuthenticated) {
    return (
      <div className="card">
        <h2 className="title">Déjà connecté ✅</h2>
        <p className="subtitle">
          Bonjour <b>{user.email}</b>.
        </p>
        <div className="form">
          <div className="actions">
            <button
              className="btn btnPrimary"
              type="button"
              onClick={() => navigate("/profile")}
            >
              Aller à mon espace
            </button>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    console.log("[LoginForm] Submit", {
      email: email.trim(),
      hasOtp: !!otpCode.trim(),
      hasBackup: !!backupCode.trim(),
    });

    try {
      const otp = otpCode.trim() || undefined;
      const backup = otp ? undefined : backupCode.trim() || undefined;

      await dispatch(loginThunk(email.trim(), password, otp, backup));
      console.log("[LoginForm] Login thunk resolved, navigating to /profile");
      navigate("/profile");
    } catch (err: any) {
      console.error("[LoginForm] Login error", err);
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Connexion impossible. Vérifie vos identifiants.";

      const lower = String(msg).toLowerCase();

      if (lower.includes("otp requis")) {
        setNeedOtp(true);
        setError(
          "Entrez le code de votre application d'authentifacation ou un code de secours.",
        );
      } else if (lower.includes("code otp invalide")) {
        setNeedOtp(true);
        setError("Code invalide. Réessaie.");
      } else if (lower.includes("code de secours")) {
        setNeedOtp(true);
        setError(msg);
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="authScreen">
      <div className="authScreen__content">
        <div className="card card--glass">
          <h2 className="title">Connexion</h2>
          <p className="subtitle">
            Connectez-vous pour accéder à votre espace.
          </p>

          <form className="form" onSubmit={onSubmit}>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="ex: armance@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Mot de passe</label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {needOtp && (
              <>
                <div className="field">
                  <label>Code (6 chiffres)</label>
                  <input
                    value={otpCode}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setOtpCode(v);
                      if (v) setBackupCode("");
                    }}
                    placeholder="ex: 123456"
                    inputMode="numeric"
                  />
                  <div className="hint">
                    Ou utilisez un code de secours si besoin.
                  </div>
                </div>

                <div className="field">
                  <label>Code de secours</label>
                  <input
                    value={backupCode}
                    onChange={(e) => {
                      const v = e.target.value.toUpperCase();
                      setBackupCode(v);
                      if (v) setOtpCode("");
                    }}
                    placeholder="ex: ABCD-EFGH"
                  />
                </div>
              </>
            )}

            {error && <div className="error">{error}</div>}

            <div className="actions">
              <button
                className="btn btnPrimary"
                type="submit"
                disabled={!canSubmit}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </button>

              <Link
                to="/register"
                className="btn btnGhost"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  justifyContent: "center",
                }}
              >
                Créer un compte
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
