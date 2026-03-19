import { useState } from "react";
import { useApp } from "@/lib/appContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LoginPage = () => {
  const { login } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      login(name.trim(), email.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm animate-slide-up">
        {/* Logo area */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">🏟️</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">PlayNearby</h1>
          <p className="text-muted-foreground mt-2 text-sm">Find sports games around you</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl bg-card border-border"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl bg-card border-border"
            />
          </div>
          {!isSignUp && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-12 rounded-xl bg-card border-border"
              />
            </div>
          )}
          <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold mt-2">
            {isSignUp ? "Get Started" : "Log In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              if (!isSignUp) setName("");
            }}
            className="text-primary font-semibold"
          >
            {isSignUp ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
