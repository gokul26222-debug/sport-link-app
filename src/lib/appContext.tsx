import React, { createContext, useContext, useState, ReactNode } from "react";
import { Game, Sport, mockGames } from "./mockData";

interface User {
  name: string;
  email: string;
  preferredSport: Sport;
}

interface AppState {
  isLoggedIn: boolean;
  user: User | null;
  games: Game[];
  joinedGameIds: string[];
  login: (name: string, email: string) => void;
  logout: () => void;
  joinGame: (gameId: string) => void;
  leaveGame: (gameId: string) => void;
  createGame: (game: Omit<Game, "id">) => void;
  updateProfile: (user: Partial<User>) => void;
  sportFilter: Sport | "All";
  setSportFilter: (filter: Sport | "All") => void;
}

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [games, setGames] = useState<Game[]>(mockGames);
  const [joinedGameIds, setJoinedGameIds] = useState<string[]>([]);
  const [sportFilter, setSportFilter] = useState<Sport | "All">("All");

  const login = (name: string, email: string) => {
    setUser({ name, email, preferredSport: "Football" });
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setJoinedGameIds([]);
  };

  const joinGame = (gameId: string) => {
    if (joinedGameIds.includes(gameId)) return;
    setJoinedGameIds((prev) => [...prev, gameId]);
    setGames((prev) =>
      prev.map((g) =>
        g.id === gameId ? { ...g, currentPlayers: g.currentPlayers + 1 } : g
      )
    );
  };

  const leaveGame = (gameId: string) => {
    setJoinedGameIds((prev) => prev.filter((id) => id !== gameId));
    setGames((prev) =>
      prev.map((g) =>
        g.id === gameId ? { ...g, currentPlayers: g.currentPlayers - 1 } : g
      )
    );
  };

  const createGame = (game: Omit<Game, "id">) => {
    const newGame: Game = { ...game, id: Date.now().toString() };
    setGames((prev) => [newGame, ...prev]);
  };

  const updateProfile = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn, user, games, joinedGameIds,
        login, logout, joinGame, leaveGame, createGame, updateProfile,
        sportFilter, setSportFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
