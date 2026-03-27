import { useState, useEffect, useMemo } from "react";
import { useApp } from "@/lib/appContext";

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
  const { login } = useApp();
  const [screen, setScreen] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [showPhone, setShowPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [areaOpen, setAreaOpen] = useState(false);

  const initials = useMemo(() => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.trim().slice(0, 2).toUpperCase() || "?";
  }, [name]);

  const canFinish = selectedSports.length > 0 && selectedLevel !== "";

  const handleGoogleLogin = () => {
    setLoading("google");
    setTimeout(() => {
      setName("Gokul K.");
      setEmail("gokul@gmail.com");
      setLoading(null);
      setScreen(3);
    }, 1500);
  };

  const handleAppleLogin = () => {
    setLoading("apple");
    setTimeout(() => {
      setName("Gokul K.");
      setEmail("gokul@icloud.com");
      setLoading(null);
      setScreen(3);
    }, 1500);
  };

  const handlePhoneLogin = () => {
    if (!showPhone) {
      setShowPhone(true);
      return;
    }
    if (phone.trim().length < 6) return;
    setLoading("phone");
    setTimeout(() => {
      setLoading(null);
      setScreen(3);
    }, 1500);
  };

  const handleEmailContinue = () => {
    if (!name.trim() || !email.trim()) return;
    setLoading("email");
    setTimeout(() => {
      setLoading(null);
      setScreen(3);
    }, 1200);
  };

  const handleFinish = () => {
    if (!canFinish) return;
    setLoading("finish");
    setTimeout(() => {
      login(name.trim() || "Player", email.trim() || "player@playpal.app");
    }, 800);
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
        {/* Top 60% */}
        <div style={{ flex: "0 0 60%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 48 }}>
          {/* Emoji collage */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, maxWidth: 260, marginBottom: 32 }}>
            {heroEmojis.map((h, i) => (
              <div
                key={i}
                style={{
                  background: "#13131A",
                  border: "0.5px solid #2a2a3a",
                  borderRadius: 16,
                  width: 72,
                  height: 72,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  transform: `rotate(${h.rot}deg)`,
                  marginTop: i >= 3 ? -8 : 0,
                }}
              >
                {h.emoji}
              </div>
            ))}
          </div>
          {/* Logo */}
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>
            <span style={{ color: "#fff" }}>Play</span>
            <span style={{ color: "#6C5CE7" }}>Pal</span>
          </h1>
          <p style={{ color: "#888", fontSize: 14, margin: "8px 0 0", textAlign: "center" }}>
            Find your game. Find your people.
          </p>
        </div>

        {/* Bottom 40% */}
        <div style={{ flex: "0 0 40%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px 40px" }}>
          {/* Paris pill */}
          <div style={{ background: "#1a1a2e", color: "#a29bfe", padding: "6px 16px", borderRadius: 20, fontSize: 13, marginBottom: 24, fontWeight: 500 }}>
            🏙️ Now in Paris
          </div>

          {/* Stats */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 36, width: "100%", justifyContent: "center" }}>
            {[
              { n: "248", l: "Players" },
              { n: "94", l: "Games" },
              { n: "12", l: "Courts" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ textAlign: "center", padding: "0 18px" }}>
                  <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{s.n}</div>
                  <div style={{ color: "#888", fontSize: 11 }}>{s.l}</div>
                </div>
                {i < 2 && <div style={{ width: 0.5, height: 28, background: "#222" }} />}
              </div>
            ))}
          </div>

          {/* Get started button */}
          <button
            onClick={() => setScreen(2)}
            style={{
              background: "#6C5CE7",
              color: "#fff",
              border: "none",
              borderRadius: 14,
              padding: "14px 0",
              width: "100%",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.2px",
            }}
          >
            Get started
          </button>

          <p style={{ color: "#555", fontSize: 11, marginTop: 16, textAlign: "center" }}>
            Already have an account?{" "}
            <span
              onClick={() => setScreen(2)}
              style={{ color: "#6C5CE7", cursor: "pointer", fontWeight: 600 }}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    );
  }

  // ---- SCREEN 2: LOGIN OPTIONS ----
  if (screen === 2) {
    return (
      <div
        style={{
          background: "#0A0A0F",
          minHeight: "100vh",
          padding: "16px 24px 32px",
          animation: "slideUp 0.4s ease-out",
          overflowY: "auto",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ width: 36, height: 4, borderRadius: 4, background: "#333" }} />
        </div>

        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Join PlayPal</h2>
        <p style={{ color: "#888", fontSize: 13, margin: "0 0 24px" }}>Connect and start playing</p>

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading !== null}
          style={{
            background: "#13131A",
            border: "0.5px solid #2a2a3a",
            borderRadius: 14,
            padding: "14px 16px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            marginBottom: 10,
            opacity: loading && loading !== "google" ? 0.5 : 1,
          }}
        >
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#4285F4", fontWeight: 700, fontSize: 14 }}>G</span>
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>
              {loading === "google" ? "Connecting to Google..." : "Continue with Google"}
            </div>
            <div style={{ color: "#888", fontSize: 11 }}>Use your Gmail account</div>
          </div>
          {loading === "google" ? (
            <Spinner />
          ) : (
            <span style={{ color: "#6C5CE7", fontSize: 16 }}>→</span>
          )}
        </button>

        {/* Apple */}
        <button
          onClick={handleAppleLogin}
          disabled={loading !== null}
          style={{
            background: "#13131A",
            border: "0.5px solid #2a2a3a",
            borderRadius: 14,
            padding: "14px 16px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            marginBottom: 10,
            opacity: loading && loading !== "apple" ? 0.5 : 1,
          }}
        >
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#000", border: "1px solid #333", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontSize: 16 }}></span>
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>
              {loading === "apple" ? "Connecting to Apple..." : "Continue with Apple"}
            </div>
            <div style={{ color: "#888", fontSize: 11 }}>Use your Apple ID</div>
          </div>
          {loading === "apple" ? (
            <Spinner />
          ) : (
            <span style={{ color: "#6C5CE7", fontSize: 16 }}>→</span>
          )}
        </button>

        {/* Phone */}
        <button
          onClick={handlePhoneLogin}
          disabled={loading !== null}
          style={{
            background: "#13131A",
            border: "0.5px solid #2a2a3a",
            borderRadius: 14,
            padding: "14px 16px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            marginBottom: showPhone ? 0 : 10,
            opacity: loading && loading !== "phone" ? 0.5 : 1,
          }}
        >
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#6C5CE7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontSize: 14 }}>📱</span>
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>
              {loading === "phone" ? "Sending code..." : "Continue with phone"}
            </div>
            <div style={{ color: "#888", fontSize: 11 }}>We'll send a verification code</div>
          </div>
          {loading === "phone" ? (
            <Spinner />
          ) : (
            <span style={{ color: "#6C5CE7", fontSize: 16 }}>→</span>
          )}
        </button>

        {showPhone && (
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+33 6 12 34 56 78"
            style={{
              background: "#13131A",
              border: "0.5px solid #2a2a3a",
              borderRadius: 12,
              padding: "14px 16px",
              color: "#fff",
              fontSize: 14,
              width: "100%",
              marginTop: 8,
              marginBottom: 10,
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#6C5CE7")}
            onBlur={(e) => (e.target.style.borderColor = "#2a2a3a")}
          />
        )}

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
          <div style={{ flex: 1, height: 0.5, background: "#2a2a3a" }} />
          <span style={{ color: "#555", fontSize: 12 }}>OR</span>
          <div style={{ flex: 1, height: 0.5, background: "#2a2a3a" }} />
        </div>

        {/* Email */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          style={{
            background: "#13131A",
            border: "0.5px solid #2a2a3a",
            borderRadius: 12,
            padding: "14px 16px",
            color: "#fff",
            fontSize: 14,
            width: "100%",
            marginBottom: 10,
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#6C5CE7")}
          onBlur={(e) => (e.target.style.borderColor = "#2a2a3a")}
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          type="email"
          style={{
            background: "#13131A",
            border: "0.5px solid #2a2a3a",
            borderRadius: 12,
            padding: "14px 16px",
            color: "#fff",
            fontSize: 14,
            width: "100%",
            marginBottom: 16,
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#6C5CE7")}
          onBlur={(e) => (e.target.style.borderColor = "#2a2a3a")}
        />

        <button
          onClick={handleEmailContinue}
          disabled={!name.trim() || !email.trim() || loading !== null}
          style={{
            background: name.trim() && email.trim() ? "#6C5CE7" : "#1a1a2e",
            color: name.trim() && email.trim() ? "#fff" : "#444",
            border: "none",
            borderRadius: 14,
            padding: 14,
            width: "100%",
            fontSize: 14,
            fontWeight: 500,
            cursor: name.trim() && email.trim() ? "pointer" : "default",
            marginBottom: 20,
          }}
        >
          {loading === "email" ? "Connecting..." : "Continue"}
        </button>

        <p style={{ color: "#555", fontSize: 11, textAlign: "center", lineHeight: 1.5 }}>
          By continuing you agree to our <span style={{ color: "#6C5CE7" }}>Terms</span> & <span style={{ color: "#6C5CE7" }}>Privacy Policy</span>
        </p>
      </div>
    );
  }

  // ---- SCREEN 3: PROFILE SETUP ----
  return (
    <div
      style={{
        background: "#0A0A0F",
        minHeight: "100vh",
        padding: "24px 24px 32px",
        animation: "slideLeft 0.4s ease-out",
        overflowY: "auto",
      }}
    >
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Set up your profile</h2>
      <p style={{ color: "#888", fontSize: 13, margin: "0 0 28px" }}>Tell us what you play</p>

      {/* Avatar */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#6C5CE7",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {initials}
        </div>
        <div style={{ color: "#6C5CE7", fontSize: 11, marginTop: 8, cursor: "pointer" }}>Add photo</div>
      </div>

      {/* Sport selection */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 12, display: "block" }}>
          What sports do you play?
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {allSports.map((s) => {
            const sel = selectedSports.includes(s.name);
            return (
              <button
                key={s.name}
                onClick={() => toggleSport(s.name)}
                style={{
                  background: sel ? "#6C5CE722" : "#13131A",
                  color: sel ? "#a29bfe" : "#888",
                  border: sel ? "1px solid #6C5CE7" : "0.5px solid #2a2a3a",
                  borderRadius: 20,
                  padding: "8px 14px",
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>{s.emoji}</span> {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skill level */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 12, display: "block" }}>
          Your level
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {levels.map((lv) => {
            const sel = selectedLevel === lv.label;
            return (
              <button
                key={lv.label}
                onClick={() => setSelectedLevel(lv.label)}
                style={{
                  background: sel ? "#0d0a1f" : "#13131A",
                  border: sel ? "1.5px solid #6C5CE7" : "0.5px solid #2a2a3a",
                  borderRadius: 12,
                  padding: 12,
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>{lv.emoji}</div>
                <div style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>{lv.label}</div>
                <div style={{ color: "#888", fontSize: 10 }}>{lv.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Location */}
      <div style={{ marginBottom: 32 }}>
        <label style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 12, display: "block" }}>
          Your area in Paris
        </label>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setAreaOpen(!areaOpen)}
            style={{
              background: "#13131A",
              border: "0.5px solid #2a2a3a",
              borderRadius: 12,
              padding: "12px 16px",
              color: selectedArea ? "#fff" : "#888",
              fontSize: 14,
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {selectedArea || "Select your area"}
            <span style={{ color: "#888", fontSize: 12 }}>▾</span>
          </button>
          {areaOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#13131A",
                border: "0.5px solid #2a2a3a",
                borderRadius: 12,
                marginTop: 4,
                zIndex: 10,
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              {areas.map((a) => (
                <div
                  key={a}
                  onClick={() => { setSelectedArea(a); setAreaOpen(false); }}
                  style={{
                    padding: "10px 16px",
                    color: selectedArea === a ? "#6C5CE7" : "#fff",
                    fontSize: 13,
                    cursor: "pointer",
                    borderBottom: "0.5px solid #1a1a2e",
                  }}
                >
                  {a}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleFinish}
        disabled={!canFinish || loading === "finish"}
        style={{
          background: canFinish ? "#6C5CE7" : "#1a1a2e",
          color: canFinish ? "#fff" : "#444",
          border: "none",
          borderRadius: 14,
          padding: 14,
          width: "100%",
          fontSize: 15,
          fontWeight: 600,
          cursor: canFinish ? "pointer" : "default",
        }}
      >
        {loading === "finish" ? "Setting up..." : "Let's play! 🎉"}
      </button>
    </div>
  );
};

const Spinner = () => (
  <div
    style={{
      width: 16,
      height: 16,
      border: "2px solid #6C5CE733",
      borderTop: "2px solid #6C5CE7",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
      flexShrink: 0,
    }}
  />
);

export default OnboardingPage;
