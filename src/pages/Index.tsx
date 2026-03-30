import { useApp } from "@/lib/appContext";
import OnboardingPage from "./OnboardingPage";
import HomePage from "./HomePage";

const Index = () => {
  const { isLoggedIn, loading } = useApp();

  if (loading) {
    return (
      <div style={{ background: "#0A0A0F", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>
            <span style={{ color: "#fff" }}>Play</span>
            <span style={{ color: "#6C5CE7" }}>Pal</span>
          </h1>
          <p style={{ color: "#888", fontSize: 14, marginTop: 8 }}>Loading...</p>
        </div>
      </div>
    );
  }

  return isLoggedIn ? <HomePage /> : <OnboardingPage />;
};

export default Index;
