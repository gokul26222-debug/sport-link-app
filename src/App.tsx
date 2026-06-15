import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/lib/appContext";
import { registerServiceWorker } from "@/lib/notifications";
import Index from "./pages/Index";
import MatchPage from "./pages/MatchPage";
import BookPage from "./pages/BookPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import GameDetailPage from "./pages/GameDetailPage";
import CreateGamePage from "./pages/CreateGamePage";
import MyGamesPage from "./pages/MyGamesPage";
import CrewsPage from "./pages/CrewsPage";
import EventsPage from "./pages/EventsPage";
import SportMapPage from "./pages/SportMapPage";
import NotFound from "./pages/NotFound";

const App = () => {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <AppProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/match" element={<MatchPage />} />
            <Route path="/book" element={<BookPage />} />
            <Route path="/map" element={<SportMapPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/game/:id" element={<GameDetailPage />} />
            <Route path="/create-game" element={<CreateGamePage />} />
            <Route path="/my-games" element={<MyGamesPage />} />
            <Route path="/crews" element={<CrewsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  );
};

export default App;
