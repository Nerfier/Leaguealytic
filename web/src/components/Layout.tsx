import { Link, Outlet } from "react-router";
import SearchBox from "./SearchBox.tsx";

export default function Layout() {
    return (
        <>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/combos">Combos</Link>
            </nav>
            <main>
                <SearchBox />
                <Outlet />
            </main>
        </>
    );
}