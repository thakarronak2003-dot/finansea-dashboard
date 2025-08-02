import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem("token");
    console.log("token", localStorage.getItem("token"));
    if (!token) return <Navigate to="/login" replace />;
    return children;
};

export default RequireAuth;
