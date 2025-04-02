export interface signUpFormType {
  name: string;
  email: string;
  password: string;
}
export interface signUpErrorType {
  name?: string;
  email?: string;
  password?: string;
}

export interface signInFormType {
  email: string;
  password: string;
}
export interface signInErrorType {
  email?: string;
  password?: string;
  login?: string;
}
