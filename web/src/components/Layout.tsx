import { Link, Outlet } from "react-router";

export default function Layout() {
    return (
        <>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/combos">Combos</Link>
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    );
}