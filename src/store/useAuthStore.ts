import { create } from 'zustand';
import { User } from '../domain/auth.types';
import { getItem, setItem, removeItem } from '../core/utils/localStorage';
import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '../core/config/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string, refreshToken?: string) => void;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

const initialToken = getItem<string>(TOKEN_KEY);
const initialRefreshToken = getItem<string>(REFRESH_TOKEN_KEY);
const initialUser = getItem<User>(USER_KEY);

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: initialToken,
  refreshToken: initialRefreshToken,
  isAuthenticated: Boolean(initialToken),

  setAuth: (user, token, refreshToken) => {
    setItem(USER_KEY, user);
    setItem(TOKEN_KEY, token);
    if (refreshToken) {
      setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    set({
      user,
      token,
      refreshToken: refreshToken || getItem<string>(REFRESH_TOKEN_KEY),
      isAuthenticated: true,
    });
  },

  setToken: (token) => {
    setItem(TOKEN_KEY, token);
    set({ token, isAuthenticated: true });
  },

  setUser: (user) => {
    setItem(USER_KEY, user);
    set({ user });
  },

  logout: () => {
    removeItem(USER_KEY);
    removeItem(TOKEN_KEY);
    removeItem(REFRESH_TOKEN_KEY);
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },
}));
