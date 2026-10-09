import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('idz_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('idz_user', JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem('idz_user');
    setUser(null);
  };

  const initials = user && user.prenom ? `${user.prenom[0]}${user.nom ? user.nom[0] : ''}` : (user?.email ? user.email[0].toUpperCase() : 'U');

  return (
    <AuthContext.Provider value={{ user, login, logout, initials }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
