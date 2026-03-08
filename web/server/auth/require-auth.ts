import { getSessionUser } from "@/server/auth/get-session-user";

export async function requireAuthUserId() {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user.id;
}
