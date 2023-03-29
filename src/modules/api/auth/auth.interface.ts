export interface ISignUp {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ISignIn {
  email: string;
  password: string;
}

export interface ISignOut {
  id: number;
}

export interface IRefreshToken {
  refreshToken: string;
}
