import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "./dynamodb";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "vedic-transform-secret-key-change-in-production"
);

const COOKIE_NAME = "vedic-auth-token";

export interface UserPayload {
  id: string;
  email: string;
  name?: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Create JWT token
export async function createToken(payload: UserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserPayload;
  } catch {
    return null;
  }
}

// Set auth cookie
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

// Remove auth cookie
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Get current user from cookie
export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

// Register new user
export async function registerUser(
  email: string,
  password: string,
  name?: string
): Promise<{ success: boolean; error?: string; user?: UserPayload }> {
  try {
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
      },
    });

    const userPayload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
    };

    // Create and set token
    const token = await createToken(userPayload);
    await setAuthCookie(token);

    return { success: true, user: userPayload };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Registration failed" };
  }
}

// Login user
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: UserPayload }> {
  try {
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return { success: false, error: "Invalid email or password" };
    }

    const userPayload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
    };

    // Create and set token
    const token = await createToken(userPayload);
    await setAuthCookie(token);

    return { success: true, user: userPayload };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed" };
  }
}

// Logout user
export async function logoutUser(): Promise<void> {
  await removeAuthCookie();
}

// Require auth - throws redirect if not authenticated
export async function requireAuth(): Promise<UserPayload> {
  const user = await getCurrentUser();

  if (!user) {
    const { redirect } = await import("next/navigation");
    redirect("/login");
    // redirect throws an error, so this line is never reached
    // but TypeScript needs this for type narrowing
    throw new Error("Redirect failed");
  }

  return user;
}
