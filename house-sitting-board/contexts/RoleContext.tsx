import React, { createContext, ReactNode, useContext, useState } from "react";

export type UserRole = "service_seeker" | "sitter" | null;

interface RoleContextType {
  role: UserRole;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  isServiceSeeker: boolean;
  isSitter: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(null);

  const logout = () => {
    setRole(null);
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
  };

  const isServiceSeeker = role === "service_seeker";
  const isSitter = role === "sitter";

  return (
    <RoleContext.Provider
      value={{
        role,
        switchRole,
        logout,
        isServiceSeeker,
        isSitter,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
