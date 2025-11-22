import { cookies } from "next/headers";
import { nanoid } from "nanoid";

const COOKIE_NAME = "tinylink_session";
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function getSessionId():Promise <string> {
  const cookieStore = await  cookies();
  let session = cookieStore.get(COOKIE_NAME);

  // If cookie exists → return it
  if (session?.value) {
    return session.value;
  }

  // Otherwise → create a new one
  const newSessionId = nanoid(24);

  cookieStore.set({
    name: COOKIE_NAME,
    value: newSessionId,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: ONE_YEAR,
  });

  return newSessionId;
}
