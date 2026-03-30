import { useState } from "react";
import { useApp } from "@/lib/appContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const LoginPage = () => {
  const { signIn, signUp } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    if (isSignUpMode) {
      const { error } = await signUp(email.trim(), password.trim(), name.trim());
      if (error) toast.error(error.message);
    } else {
      const { error } = await signIn(email.trim(), password.trim());
      if (error) toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            <span>Play</span><span className="text-primary">Pal</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">Find your game. Find your people.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUpMode && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Name</label>
              <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-2xl bg-card border-border/50 text-foreground placeholder:text-muted-foreground" />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Email</label>
            <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-2xl bg-card border-border/50 text-foreground placeholder:text-muted-foreground" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Password</label>
            <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-2xl bg-card border-border/50 text-foreground placeholder:text-muted-foreground" />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12 rounded-2xl text-base font-semibold mt-2">
            {loading ? "Loading..." : isSignUpMode ? "Get Started" : "Log In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          {isSignUpMode ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsSignUpMode(!isSignUpMode)} className="text-primary font-semibold">
            {isSignUpMode ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
