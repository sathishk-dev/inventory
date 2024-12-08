import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children }) {
    const [isValid, setIsValid] = useState(null);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem("token");
            const isLoggedIn = localStorage.getItem("isLoggedIn");
            if (!token || !isLoggedIn) {
                setIsValid(false);
                return;
            }

            try {
                const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/protected`,{},{ headers: { Authorization: `Bearer ${token}` } });
                setIsValid(data.valid);
            } 
            catch (err) {
                localStorage.removeItem('token');
                localStorage.removeItem('isLoggedIn');
                console.error("Token validation failed:", err.response?.data?.message || err.message);
                setIsValid(false);
            }
        };

        validateToken();
    }, []);

    if (isValid === null) {
        return <div>Loading...</div>;
    }

    if (!isValid) {
        return <Navigate to="/" replace />;
    }

    return children;
}
