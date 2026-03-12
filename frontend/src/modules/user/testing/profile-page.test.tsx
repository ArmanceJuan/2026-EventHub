import React from "react";
import { render, screen } from "@testing-library/react";
import { AuthProvider, useAuth } from "../../store/auth-context.provider";
import { ProfilePage } from "../components/profile-page.component";

const mockUser = {
  id: "1",
  firstName: "Jean",
  lastName: "Martin",
  email: "jean@test.com",
  password: "Valid12Char!",
};

describe("ProfilePage", () => {
  it("affiche un message si l'utilisateur n'est pas connecté", () => {
    render(
      <AuthProvider>
        <ProfilePage />
      </AuthProvider>
    );
    expect(screen.getByText(/veuillez vous connecter/i)).toBeInTheDocument();
  });

  // it("affiche les informations de l'utilisateur connecté et les boutons", () => {
  //   const Wrapper: React.FC<{ children?: React.ReactNode }> = ({
  //     children,
  //   }) => {
  //     const { register } = useAuth();
  //     React.useEffect(() => {
  //       register(mockUser);
  //     }, [register]);
  //     return <>{children}</>;
  //   };

  //   render(
  //     <AuthProvider>
  //       <Wrapper>
  //         <ProfilePage />
  //       </Wrapper>
  //     </AuthProvider>
  //   );

  //   expect(screen.getByText(/Jean Martin/i)).toBeInTheDocument();
  //   expect(screen.getByText(/jean@test.com/i)).toBeInTheDocument();
  //   expect(screen.getByText(/modifier le profil/i)).toBeInTheDocument();
  //   expect(screen.getByText(/déconnexion/i)).toBeInTheDocument();
  // });
});
