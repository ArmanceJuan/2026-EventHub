import React, { useState, useEffect } from "react";
import { getPasswordErrors } from "./password-errors.util";

export const PasswordField: React.FC<{
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}> = ({ label, value = "", onChange, onBlur }) => {
  const [internalPassword, setInternalPassword] = useState(value);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setInternalPassword(value);
  }, [value]);

  const errors = getPasswordErrors(internalPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalPassword(newValue);
    onChange?.(newValue);
  };

  const handleBlur = () => {
    setTouched(true);
    onBlur?.();
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        htmlFor="password-field"
        style={{ display: "block", marginBottom: "8px" }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id="password-field"
          type={showPassword ? "text" : "password"}
          value={internalPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-label={label}
          style={{
            width: "100%",
            padding: "10px",
            paddingRight: "40px",
            border:
              touched && errors.length > 0 ? "1px solid red" : "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={
            showPassword
              ? "Masquer le mot de passe"
              : "Afficher le mot de passe"
          }
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.2em",
          }}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      {touched && errors.length > 0 && (
        <ul
          aria-live="polite"
          style={{
            color: "red",
            margin: "8px 0 0",
            paddingLeft: "20px",
            fontSize: "0.9em",
          }}
        >
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
