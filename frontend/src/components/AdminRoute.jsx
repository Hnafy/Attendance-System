import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth";

export default function AdminRoute({ children }) {
    const { admin } = useAuth();

    console.log("Admin route check:", admin);

    if (!admin || Object.keys(admin).length === 0) {
        return children;
    }

    if (admin.isAdmin) {
        return <Navigate to={`/admin/${admin.id}`} />;
    }

    return children;
}
