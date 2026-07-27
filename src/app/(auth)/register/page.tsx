import { redirect } from "next/navigation";

export default function RegisterPage() {
  // Fallback for any path that slips past the next.config redirect —
  // server-side, so no-JS agents and crawlers never see an empty shell.
  redirect("/login/?tab=signup");
}
