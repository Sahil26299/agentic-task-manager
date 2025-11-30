
export interface UserInterface {
  id: string;
  name: string;
  phone?: string;
  countryCode?: string;
  email: string;
}

export interface AuthContextType {
  user: UserInterface | null;
  token: string | null;
  login: (token: string, user: UserInterface) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}