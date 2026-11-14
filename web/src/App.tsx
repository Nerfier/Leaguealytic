import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PlayerPage from "./pages/PlayerPage";
import MatchHistoryPage from "./pages/MatchHistoryPage";
import CombosPage from "./pages/CombosPage";

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