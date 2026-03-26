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
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-5 backdrop-blur-sm border border-primary/30">
            <span className="text-3xl">🏟️</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">PlayNearby</h1>
          <p className="text-muted-foreground mt-2 text-sm">Find sports games around you</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Name</label>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-2xl bg-card border-border/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-2xl bg-card border-border/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          {!isSignUp && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-12 rounded-2xl bg-card border-border/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}
          <Button type="submit" className="w-full h-12 rounded-2xl text-base font-semibold mt-2">
            {isSignUp ? "Get Started" : "Log In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
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
