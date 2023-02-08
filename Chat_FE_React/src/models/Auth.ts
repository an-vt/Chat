export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

export interface AuthLogin {
  email: string;
  password: string;
}

export interface AuthRegister {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}
