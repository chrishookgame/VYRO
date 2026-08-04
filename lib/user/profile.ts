export type UserProfile = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
};

const DEFAULT_PROFILE: UserProfile = {
  id: "demo-user",
  name: "Demo User",
  username: "demouser",
  email: "demo@vyro.ai",
  avatar: "",
};

export function getCurrentUserProfile():
  UserProfile {
  return DEFAULT_PROFILE;
}
