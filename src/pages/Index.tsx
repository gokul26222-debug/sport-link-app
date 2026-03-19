import { useApp } from "@/lib/appContext";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";

const Index = () => {
  const { isLoggedIn } = useApp();
  return isLoggedIn ? <HomePage /> : <LoginPage />;
};

export default Index;
