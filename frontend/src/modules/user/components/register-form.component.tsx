import { FormEvent, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../store/auth-context.provider";

export function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      email.trim().length > 0 &&
      password.length >= 6 &&
      confirm.length >= 6 &&
      password === confirm &&
      !isLoading
    );
  }, [email, password, confirm, isLoading]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    try {
      await register(email.trim(), password);
      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Inscription impossible. Réessaie.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="authScreen">
      <div className="authScreen__content">
        <div className="card card--glass">
          <h2 className="title">Créer un compte</h2>
          <p className="subtitle">
            Créez votre compte pour accéder à votre espace personnel.
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
                autoComplete="new-password"
                placeholder="Min. 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="hint">
                Conseil : utilisez une phrase de passe.
              </div>
            </div>

            <div className="field">
              <label>Confirmer le mot de passe</label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Confirmer le mot de passe"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            {password && confirm && password !== confirm && (
              <div className="error">
                Les mots de passe ne correspondent pas.
              </div>
            )}

            {error && <div className="error">{error}</div>}

            <div className="actions">
              <button
                className="btn btnPrimary"
                type="submit"
                disabled={!canSubmit}
              >
                {isLoading ? "Création..." : "Créer mon compte"}
              </button>

              <Link
                to="/login"
                className="btn btnGhost"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  justifyContent: "center",
                }}
              >
                J’ai déjà un compte
              </Link>
            </div>

            <div className="hint">
              Une fois votre compte créé, connectez-vous pour accéder à votre
              espace.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
