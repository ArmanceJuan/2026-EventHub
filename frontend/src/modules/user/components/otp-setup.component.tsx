import { useState } from "react";
import { useSelector } from "react-redux";
import { axiosWithAuthApi } from "../../../services/axios-instance-api.service";
import { AppState } from "../../store/store";

type QrCode = {
  image: string;
  username: string;
  secret: string;
};

type QrCodeResponse = {
  success: boolean;
  data: {
    qrCode: QrCode;
  };
  error?: { message?: string; code?: number } | null;
};

type EnableResponse = {
  success: boolean;
  data: {
    message: string;
    backupCodes?: string[];
  };
  error?: { message?: string; code?: number } | null;
};

function getApiErrorMessage(err: any): string {
  return (
    err?.response?.data?.error?.message ||
    err?.response?.data?.message ||
    err?.message ||
    "Une erreur est survenue."
  );
}

export function OtpSetup() {
  const { isAuthenticated } = useSelector((state: AppState) => state.auth);

  const [qr, setQr] = useState<QrCode | null>(null);
  const [code, setCode] = useState("");

  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);

  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [loadingEnable, setLoadingEnable] = useState(false);


  if (!isAuthenticated) return <div className="card">Connecte-toi d’abord.</div>;

  const downloadBackupCodes = (codes: string[]) => {
    const content =
      `EventHub — Codes de secours (2FA)\n` +
      `Générés le: ${new Date().toLocaleString()}\n\n` +
      codes.join("\n") +
      "\n\nIMPORTANT: Conserve-les en lieu sûr. Ils ne seront plus affichés.\n";

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "eventhub-backup-codes.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  const loadQr = async () => {
    setError(null);
    setStatus(null);
    setBackupCodes(null);
    setLoadingQr(true);

    try {
      const res = await axiosWithAuthApi.get<QrCodeResponse>("/a2f/qrcode");

      // ✅ ton backend: { success, data: { qrCode } }
      setQr(res.data.data.qrCode);
      setCode("");
      setStatus("QR Code généré. Scanne-le avec ton app OTP.");
    } catch (e: any) {
      setError(getApiErrorMessage(e) || "Impossible de générer le QR Code.");
    } finally {
      setLoadingQr(false);
    }
  };

  const enableOtp = async () => {
    if (!qr?.secret) return setError("Génère d'abord un QR Code.");
    if (!/^\d{6}$/.test(code.trim()))
      return setError("Le code doit faire 6 chiffres.");

    setError(null);
    setStatus(null);
    setLoadingEnable(true);

    try {
      const res = await axiosWithAuthApi.post<EnableResponse>(
        "/a2f/enable",
        { secret: qr.secret, code: code.trim() },
      );

      // ✅ ton backend: { success, data: { message, backupCodes } }
      const codes = res.data.data.backupCodes ?? [];
      setBackupCodes(codes);

      setStatus(
        codes.length
          ? "✅ 2FA activée ! Pense à sauvegarder tes codes de secours."
          : "✅ 2FA activée !",
      );
    } catch (e: any) {
      setError(getApiErrorMessage(e) || "Activation impossible.");
    } finally {
      setLoadingEnable(false);
    }
  };

  return (
    <div className="card">
      <h2 className="title">Sécurité — Double authentification (OTP)</h2>
      <p className="subtitle">
        Scanne le QR code dans Google Authenticator / Authy, puis saisis le code
        à 6 chiffres.
      </p>

      <div className="form">
        <div className="actions">
          <button
            className="btn btnPrimary"
            type="button"
            onClick={loadQr}
            disabled={loadingQr}
          >
            {loadingQr ? "Génération..." : "Générer un QR Code"}
          </button>
        </div>

        {qr && (
          <>
            <div className="field">
              <label>QR Code</label>
              <img
                src={qr.image}
                alt="OTP QR Code"
                style={{
                  width: 220,
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                }}
              />
            </div>

            <div className="field">
              <label>Secret (si tu ne peux pas scanner)</label>
              <input value={qr.secret} readOnly />
            </div>

            <div className="field">
              <label>Code OTP (6 chiffres)</label>
              <input
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="ex: 123456"
                inputMode="numeric"
              />
            </div>

            <div className="actions">
              <button
                className="btn btnPrimary"
                type="button"
                onClick={enableOtp}
                disabled={loadingEnable}
              >
                {loadingEnable ? "Activation..." : "Activer la 2FA"}
              </button>
            </div>
          </>
        )}

        {backupCodes?.length ? (
          <div className="field">
            <label>Codes de secours (à conserver)</label>

            <pre
              style={{
                whiteSpace: "pre-wrap",
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 12,
                marginTop: 8,
              }}
            >
              {backupCodes.join("\n")}
            </pre>

            <div className="actions" style={{ marginTop: 10 }}>
              <button
                className="btn btnGhost"
                type="button"
                onClick={() => downloadBackupCodes(backupCodes)}
              >
                Télécharger en .txt
              </button>
            </div>

            <div className="hint">
              Sauvegarde-les maintenant : ils ne seront plus affichés ensuite.
            </div>
          </div>
        ) : null}

        {status && <div className="hint">{status}</div>}
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}
