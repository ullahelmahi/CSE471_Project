import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { RiseLoader } from "react-spinners";

const PrivateRoutes = ({ children }) => {
    
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();
    
    if (loading) {
        return <RiseLoader
            color="#e910cd"
            loading
            size={35}
            speedMultiplier={1}
        />
    }

    if (user) {
        return children;
    }
    return <Navigate to="/login" state={{from: location}} replace></Navigate>

};

export default PrivateRoutes;