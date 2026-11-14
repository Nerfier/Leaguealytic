import { Routes, Route } from "react-router";
import Layout from "./components/Layout.tsx";
import HomePage from "./pages/HomePage.tsx";
import PlayerPage from "./pages/PlayerPage.tsx";
import MatchHistoryPage from "./pages/MatchHistoryPage.tsx";
import CombosPage from "./pages/CombosPage.tsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/player/:name/:tag" element={<PlayerPage />} />
        <Route path="/player/:name/:tag/matches" element={<MatchHistoryPage />} />
        <Route path="/combos" element={<CombosPage />} />
        <Route path="*" element={<p>Page not found</p>} />
      </Route>
    </Routes>
  );
}