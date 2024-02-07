export interface AuthResponse {
  token: string;
}

export interface AuthRequest {
  email: string;
}

export interface AuthManager {
  logout: () => void;
}
