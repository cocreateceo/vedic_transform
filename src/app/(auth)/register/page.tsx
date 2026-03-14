"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified login page with signup tab
    router.replace("/login?tab=signup");
  }, [router]);

  return null;
}
