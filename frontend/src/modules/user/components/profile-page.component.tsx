import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth-context.provider";

export function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return (
      <div className="card">
        <h2 className="title">Accès refusé</h2>
        <p className="subtitle">Tu dois être connecté pour voir ton profil.</p>
        <div className="form">
          <div className="actions">
            <button
              className="btn btnPrimary"
              type="button"
              onClick={() => navigate("/login")}
            >
              Aller au login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="title">Mon profil</h2>
      <p className="subtitle">Informations de compte et sécurité.</p>

      <div className="form">
        <div className="field">
          <label>Email</label>
          <input value={currentUser.email} readOnly />
        </div>

        <div className="field">
          <label>Statut</label>
          <input value="Connecté" readOnly />
          <div className="hint">
            Renforcez la sécurité de votre compte en activant la double
            authentification.
          </div>
        </div>

        <div className="actions">
          <button
            className="btn btnPrimary"
            type="button"
            onClick={() => navigate("/profile/security")}
          >
            Gérer la double authentification
          </button>

          <button
            className="btn btnGhost"
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
