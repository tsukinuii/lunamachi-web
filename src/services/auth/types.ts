export type MeResponse = {
  success: boolean;
  data: {
    id: string;
    email: string;
    username?: string;
    name?: string;
  };
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  otp: string;
  password: string;
  username: string;
  name: string;
  lastname: string;
  avatarUrl: string;
};

export type Me = { id: string; email?: string; name?: string };

export type SocialProvider = "google" | "github";

