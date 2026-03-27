import { useApp } from "@/lib/appContext";
import OnboardingPage from "./OnboardingPage";
import HomePage from "./HomePage";

const Index = () => {
  const { isLoggedIn } = useApp();
  return isLoggedIn ? <HomePage /> : <OnboardingPage />;
};

export default Index;
