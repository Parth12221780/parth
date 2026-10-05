import { getUser } from "@netlify/identity";

// Returns a 401/403 response when the caller is not a Netlify Identity user with the "admin" role.
export async function requireAdmin(): Promise<Response | null> {
  const user = await getUser();
  if (!user) return Response.json({ error: "Please sign in." }, { status: 401 });
  if (!(user.roles || []).includes("admin")) return Response.json({ error: "Your account does not have the admin role." }, { status: 403 });
  return null;
}
