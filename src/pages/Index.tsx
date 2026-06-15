import { useApp } from "@/lib/appContext";
import OnboardingPage from "./OnboardingPage";
import HomePage from "./HomePage";

const Index = () => {
  const { isLoggedIn, loading } = useApp();

  if (loading) {
    return (
      <div style={{
        background: "#0A0A0F",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>
            <span style={{ color: "#fff" }}>Play</span>
            <span style={{ color: "#6C5CE7" }}>Pal</span>
          </h1>
          <div style={{
            width: 32,
            height: 32,
            border: "3px solid #6C5CE733",
            borderTop: "3px solid #6C5CE7",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "16px auto 0",
          }} />
        </div>
      </div>
    );
  }

  // Show home feed to all users (logged-in and guests).
  // Guests can browse all games, map, leaderboard without signing in.
  // Sign-in prompt appears only when they try to join/create.
  return <HomePage />;
};

export default Index;
