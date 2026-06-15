import { useState, useMemo } from "react";
import { useApp } from "@/lib/appContext";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

const allSports = [
  { emoji: "⚽", name: "Football" },
  { emoji: "🏀", name: "Basketball" },
  { emoji: "🎾", name: "Tennis" },
  { emoji: "🏸", name: "Badminton" },
  { emoji: "🏐", name: "Volleyball" },
  { emoji: "🏊", name: "Swimming" },
  { emoji: "🥊", name: "Boxing" },
  { emoji: "🏃", name: "Running" },
  { emoji: "🏓", name: "Table Tennis" },
];

const levels = [
  { emoji: "🌱", label: "Beginner", sub: "Just starting" },
  { emoji: "🔥", label: "Intermediate", sub: "Know the basics" },
  { emoji: "⚡", label: "Advanced", sub: "Competitive" },
];

const areas = [
  "Montmartre", "République", "Marais", "Bastille",
  "Nation", "Oberkampf", "Belleville", "Saint-Germain",
];

const heroEmojis = [
  { emoji: "⚽", rot: -6 }, { emoji: "🏀", rot: 6 }, { emoji: "🎾", rot: -6 },
  { emoji: "🏸", rot: 6 }, { emoji: "🏐", rot: -6 }, { emoji: "🏊", rot: 6 },
];

const OnboardingPage = () => {
  const { signUp, signIn, signInWithGoogle, signInWithApple, updateProfile } = useApp();
  const [screen, setScreen] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [areaOpen, setAreaOpen] = useState(false);

  const initials = useMemo(() => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.trim().slice(0, 2).toUpperCase() || "?";
  }, [name]);

  const canFinish = selectedSports.length > 0 && selectedLevel !== "";

  const handleGoogleLogin = async () => {
    setLoading("google");
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result?.error) {
        toast.error("Google sign-in failed");
        setLoading(null);
      }
    } catch {
      toast.error("Google sign-in failed");
      setLoading(null);
    }
  };

  const handleAppleLogin = async () => {
    setLoading("apple");
    await signInWithApple();
  };

  const handleEmailContinue = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading("email");
    try {
      if (isSignUp) {
        if (!name.trim()) {
          toast.error("Please enter your name");
          setLoading(null);
          return;
        }
        const { error } = await signUp(email.trim(), password.trim(), name.trim());
        if (error) {
          // "User already registered" → guide them to log in
          if (error.message?.toLowerCase().includes("already registered") ||
              error.message?.toLowerCase().includes("already exists")) {
            toast.error("Account already exists — try logging in instead");
            setIsSignUp(false);
          } else {
            toast.error(error.message || "Sign up failed");
          }
          setLoading(null);
          return;
        }
        // Account created — profile was created in signUp()
        // Even if email confirmation is required, we move to profile setup.
        // The user will be able to log in after confirming their email.
        toast.success("Account created! Check your email to confirm ✉️");
        setScreen(3);
      } else {
        const { error } = await signIn(email.trim(), password.trim());
        if (error) {
          if (error.message?.toLowerCase().includes("email not confirmed")) {
            toast.error("Please confirm your email first — check your inbox");
          } else if (error.message?.toLowerCase().includes("invalid login")) {
            toast.error("Wrong email or password");
          } else {
            toast.error(error.message || "Login failed");
          }
          setLoading(null);
          return;
        }
        // onAuthStateChange fires → isLoggedIn becomes true → Index renders HomePage
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(null);
  };

  const handleFinish = async () => {
    if (!canFinish) return;
    setLoading("finish");
    try {
      await updateProfile({
        preferred_sports: selectedSports,
        skill_level: selectedLevel,
        area: selectedArea || null,
      });
    } catch {
      // profile update failed but user is still logged in
    }
    setLoading(null);
    // Auth state already set — Index will redirect to Home
  };

  const toggleSport = (s: string) => {
    setSelectedSports((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  // ---- SCREEN 1: SPLASH ----
  if (screen === 1) {
    return (
      <div style={{ background: "#0A0A0F", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: "0 0 60%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 48 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, maxWidth: 260, marginBottom: 32 }}>
            {heroEmojis.map((h, i) => (
              <div key={i} style={{ background: "#13131A", border: "0.5px solid #2a2a3a", borderRadius: 16, width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, transform: `rotate(${h.rot}deg)`, marginTop: i >= 3 ? -8 : 0 }}>
                {h.emoji}
              </div>
            ))}
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>
            <span style={{ color: "#fff" }}>Play</span>
            <span style={{ color: "#6C5CE7" }}>Pal</span>
          </h1>
          <p style={{ color: "#888", fontSize: 14, margin: "8px 0 0", textAlign: "center" }}>
            Find your game. Find your people.
          </p>
        </div>
        <div style={{ flex: "0 0 40%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px 40px" }}>
          <div style={{ background: "#1a1a2e", color: "#a29bfe", padding: "6px 16px", borderRadius: 20, fontSize: 13, marginBottom: 24, fontWeight: 500 }}>
            🏙️ Now in Paris
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 36, width: "100%", justifyContent: "center" }}>
            {[{ n: "248", l: "Players" }, { n: "94", l: "Games" }, { n: "12", l: "Courts" }].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ textAlign: "center", padding: "0 18px" }}>
                  <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{s.n}</div>
                  <div style={{ color: "#888", fontSize: 11 }}>{s.l}</div>
                </div>
                {i < 2 && <div style={{ width: 0.5, height: 28, background: "#222" }} />}
              </div>
            ))}
          </div>
          <button onClick={() => setScreen(2)} style={{ background: "#6C5CE7", color: "#fff", border: "none", borderRadius: 14, padding: "14px 0", width: "100%", fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: "0.2px" }}>
            Get started
          </button>
          <p style={{ color: "#555", fontSize: 11, marginTop: 16, textAlign: "center" }}>
            Already have an account?{" "}
            <span onClick={() => { setIsSignUp(false); setScreen(2); }} style={{ color: "#6C5CE7", cursor: "pointer", fontWeight: 600 }}>Log in</span>
          </p>
        </div>
      </div>
    );
  }

  // ---- SCREEN 2: LOGIN OPTIONS ----
  if (screen === 2) {
    return (
      <div style={{ background: "#0A0A0F", minHeight: "100vh", padding: "16px 24px 32px", animation: "slideUp 0.4s ease-out", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ width: 36, height: 4, borderRadius: 4, background: "#333" }} />
        </div>

        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>
          {isSignUp ? "Join PlayPal" : "Welcome back"}
        </h2>
        <p style={{ color: "#888", fontSize: 13, margin: "0 0 24px" }}>
          {isSignUp ? "Create your account" : "Log in to your account"}
        </p>

        {/* Google */}
        <button onClick={handleGoogleLogin} disabled={loading !== null} style={{ background: "#13131A", border: "0.5px solid #2a2a3a", borderRadius: 14, padding: "14px 16px", width: "100%", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 10, opacity: loading && loading !== "google" ? 0.5 : 1 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#4285F4", fontWeight: 700, fontSize: 14 }}>G</span>
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{loading === "google" ? "Connecting..." : "Continue with Google"}</div>
            <div style={{ color: "#888", fontSize: 11 }}>Use your Gmail account</div>
          </div>
          {loading === "google" ? <Spinner /> : <span style={{ color: "#6C5CE7", fontSize: 16 }}>→</span>}
        </button>

        {/* Apple */}
        <button onClick={handleAppleLogin} disabled={loading !== null} style={{ background: "#13131A", border: "0.5px solid #2a2a3a", borderRadius: 14, padding: "14px 16px", width: "100%", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 10, opacity: loading && loading !== "apple" ? 0.5 : 1 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#000", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontSize: 16 }}></span>
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{loading === "apple" ? "Connecting..." : "Continue with Apple"}</div>
            <div style={{ color: "#888", fontSize: 11 }}>Use your Apple ID</div>
          </div>
          {loading === "apple" ? <Spinner /> : <span style={{ color: "#6C5CE7", fontSize: 16 }}>→</span>}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
          <div style={{ flex: 1, height: 0.5, background: "#2a2a3a" }} />
          <span style={{ color: "#555", fontSize: 12 }}>OR</span>
          <div style={{ flex: 1, height: 0.5, background: "#2a2a3a" }} />
        </div>

        {/* Email form */}
        {isSignUp && (
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={{ background: "#13131A", border: "0.5px solid #2a2a3a", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 14, width: "100%", marginBottom: 10, outline: "none", boxSizing: "border-box" }} onFocus={(e) => (e.target.style.borderColor = "#6C5CE7")} onBlur={(e) => (e.target.style.borderColor = "#2a2a3a")} />
        )}
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" style={{ background: "#13131A", border: "0.5px solid #2a2a3a", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 14, width: "100%", marginBottom: 10, outline: "none", boxSizing: "border-box" }} onFocus={(e) => (e.target.style.borderColor = "#6C5CE7")} onBlur={(e) => (e.target.style.borderColor = "#2a2a3a")} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" style={{ background: "#13131A", border: "0.5px solid #2a2a3a", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 14, width: "100%", marginBottom: 16, outline: "none", boxSizing: "border-box" }} onFocus={(e) => (e.target.style.borderColor = "#6C5CE7")} onBlur={(e) => (e.target.style.borderColor = "#2a2a3a")} />

        <button onClick={handleEmailContinue} disabled={!email.trim() || !password.trim() || loading !== null} style={{ background: email.trim() && password.trim() ? "#6C5CE7" : "#1a1a2e", color: email.trim() && password.trim() ? "#fff" : "#444", border: "none", borderRadius: 14, padding: 14, width: "100%", fontSize: 14, fontWeight: 500, cursor: email.trim() && password.trim() ? "pointer" : "default", marginBottom: 12 }}>
          {loading === "email" ? "Connecting..." : isSignUp ? "Create account" : "Log in"}
        </button>

        <p style={{ color: "#888", fontSize: 12, textAlign: "center", marginBottom: 20 }}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => setIsSignUp(!isSignUp)} style={{ color: "#6C5CE7", cursor: "pointer", fontWeight: 600 }}>
            {isSignUp ? "Log in" : "Sign up"}
          </span>
        </p>

        <p style={{ color: "#555", fontSize: 11, textAlign: "center", lineHeight: 1.5 }}>
          By continuing you agree to our <span style={{ color: "#6C5CE7" }}>Terms</span> & <span style={{ color: "#6C5CE7" }}>Privacy Policy</span>
        </p>
      </div>
    );
  }

  // ---- SCREEN 3: PROFILE SETUP ----
  return (
    <div style={{ background: "#0A0A0F", minHeight: "100vh", padding: "24px 24px 32px", animation: "slideLeft 0.4s ease-out", overflowY: "auto" }}>
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Set up your profile</h2>
      <p style={{ color: "#888", fontSize: 13, margin: "0 0 28px" }}>Tell us what you play</p>

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#6C5CE7", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff" }}>
          {initials}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <label style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 12, display: "block" }}>What sports do you play?</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {allSports.map((s) => {
            const sel = selectedSports.includes(s.name);
            return (
              <button key={s.name} onClick={() => toggleSport(s.name)} style={{ background: sel ? "#6C5CE722" : "#13131A", color: sel ? "#a29bfe" : "#888", border: sel ? "1px solid #6C5CE7" : "0.5px solid #2a2a3a", borderRadius: 20, padding: "8px 14px", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <span>{s.emoji}</span> {s.name}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <label style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 12, display: "block" }}>Your level</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {levels.map((lv) => {
            const sel = selectedLevel === lv.label;
            return (
              <button key={lv.label} onClick={() => setSelectedLevel(lv.label)} style={{ background: sel ? "#0d0a1f" : "#13131A", border: sel ? "1.5px solid #6C5CE7" : "0.5px solid #2a2a3a", borderRadius: 12, padding: 12, textAlign: "center", cursor: "pointer" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{lv.emoji}</div>
                <div style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>{lv.label}</div>
                <div style={{ color: "#888", fontSize: 10 }}>{lv.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <label style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 12, display: "block" }}>Your area in Paris</label>
        <div style={{ position: "relative" }}>
          <button onClick={() => setAreaOpen(!areaOpen)} style={{ background: "#13131A", border: "0.5px solid #2a2a3a", borderRadius: 12, padding: "12px 16px", color: selectedArea ? "#fff" : "#888", fontSize: 14, width: "100%", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {selectedArea || "Select your area"}
            <span style={{ color: "#888", fontSize: 12 }}>▾</span>
          </button>
          {areaOpen && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#13131A", border: "0.5px solid #2a2a3a", borderRadius: 12, marginTop: 4, zIndex: 10, maxHeight: 200, overflowY: "auto" }}>
              {areas.map((a) => (
                <div key={a} onClick={() => { setSelectedArea(a); setAreaOpen(false); }} style={{ padding: "10px 16px", color: selectedArea === a ? "#6C5CE7" : "#fff", fontSize: 13, cursor: "pointer", borderBottom: "0.5px solid #1a1a2e" }}>
                  {a}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button onClick={handleFinish} disabled={!canFinish || loading === "finish"} style={{ background: canFinish ? "#6C5CE7" : "#1a1a2e", color: canFinish ? "#fff" : "#444", border: "none", borderRadius: 14, padding: 14, width: "100%", fontSize: 15, fontWeight: 600, cursor: canFinish ? "pointer" : "default" }}>
        {loading === "finish" ? "Setting up..." : "Let's play! 🎉"}
      </button>
    </div>
  );
};

const Spinner = () => (
  <div style={{ width: 16, height: 16, border: "2px solid #6C5CE733", borderTop: "2px solid #6C5CE7", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
);

export default OnboardingPage;
