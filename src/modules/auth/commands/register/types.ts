export type RegisterInput = {
  email: string;
  login: string;
  passw: string;
};

export type RegisterOutput = () => Promise<void>;
