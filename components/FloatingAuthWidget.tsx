"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

export default function FloatingAuthWidget() {
  const { data: session, status } = useSession();
  const user = session?.user as { name?: string; username?: string };
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  // Show widget and clear hide timer when mouse enters
  const handleMouseEnter = () => {
    setVisible(true);
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  // Start hide timer when mouse leaves
  const handleMouseLeave = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
    }, 100);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  // Hotspot mouse enter: show widget
  const handleHotspotEnter = () => {
    setVisible(true);
  };

  const handleSignIn = () => {
    signIn("credentials");
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };

  return (
    <>
      {/* Hotspot area */}
      {!visible && (
        <div
          onMouseEnter={handleHotspotEnter}
          style={{
            position: "fixed",
            bottom: "0.5rem",
            right: "2rem",
            width: "60px",
            height: "20px",
            background: "rgba(30,30,30,0.3)",
            borderRadius: "10px 10px 0 0",
            zIndex: 999,
            cursor: "pointer",
            transition: "background 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "0.9rem",
            opacity: 0.7,
          }}
        ></div>
      )}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "fixed",
          bottom: visible ? "2rem" : "-140px", // Slide down when hidden
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
          transition: "bottom 0.5s cubic-bezier(.4,0,.2,1)",
          willChange: "bottom",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          {status === "loading" ? (
            "Loading..."
          ) : session?.user ? (
            <>Hi, {user.name || user.username} ⚔️🛡️</>
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
    </>
  );
}
