// import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../context/Auth";
import { useTheme } from "../context/useTheme";

export default function Nav() {
    const location = useLocation();
    const [activePage, setActivePage] = useState(location.pathname);
    const { user } = useAuth();
    const { toggleTheme, isDark } = useTheme();
    const token = Cookies.get("token");

    useEffect(() => {
        setActivePage(location.pathname);
    }, [location]);

    return (
        <div className="no-print flex w-full min-h-[130px] justify-between items-center py-10 bg-transparent relative">
            {/* logo */}
            <div
                className="no-print text-2xl active cursor-pointer"
                onClick={() => setActivePage("/home")}
            >
                <Link>NUSC</Link>
            </div>

            {/* line image */}
            <div className="bg-[url(/Line-8.png)] w-full h-[25px] absolute bottom-[15px] bg-no-repeat bg-contain"></div>

            <div className="flex items-center text-xs gap-1 md:text-xl md:gap-5">
                {token && (
                    <>
                        {user && user.isAdmin && (
                            <Link
                                to="/AdminPanel"
                                onClick={() => setActivePage("/AdminPanel")}
                                className={
                                    activePage === "/AdminPanel"
                                        ? "active hidden md:block"
                                        : "hidden md:block"
                                }
                            >
                                AdminPanel
                            </Link>
                        )}
                        <Link to={`/student/${user.id}`}>
                            <h2>{user.name}</h2>
                        </Link>
                    </>
                )}
                <button
                    onClick={toggleTheme}
                    className="no-print p-2 rounded-full cursor-pointer hover:bg-surface transition-colors"
                >
                    {isDark ? "🌞" : "🌙"}
                </button>
            </div>
        </div>
    );
}
