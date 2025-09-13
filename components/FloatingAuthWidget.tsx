"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function FloatingAuthWidget() {
  const { data: session, status } = useSession();
  const user = session?.user as { name?: string; username?: string };
  const router = useRouter();

  const handleSignIn = () => {
    signIn("credentials");
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 1000,
        background: "rgba(30, 30, 30, 0.95)",
        borderRadius: "50px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        color: "#fff",
        minWidth: "180px",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        {status === "loading" ? (
          "Loading..."
        ) : session?.user ? (
          <>Hi, {user.name || user.username}</>
        ) : (
          "Not signed in"
        )}
      </div>
      {session?.user ? (
        <button
          onClick={handleSignOut}
          style={{
            background: "#222",
            color: "#fff",
            border: "none",
            borderRadius: "20px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      ) : (
        <button
          onClick={handleSignIn}
          style={{
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "20px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Sign In
        </button>
      )}
    </div>
  );
}
