import { CssBaseline } from "@mui/material";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
};
