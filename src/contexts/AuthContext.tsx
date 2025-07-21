// This file is deprecated and replaced by /src/contexts/LockContext.tsx
// It is kept to avoid breaking build processes but is no longer used.
import { createContext } from 'react';

const DeprecatedAuthContext = createContext({});
export const AuthProvider = ({ children }: { children: React.ReactNode }) => children;
export const useAuth = () => ({
  user: null,
  isLoading: false,
  isFirebaseConfigured: false,
  login: () => Promise.reject(),
  signup: () => Promise.reject(),
  logout: () => Promise.resolve(),
});
