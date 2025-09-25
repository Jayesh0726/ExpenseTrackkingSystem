import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {useNavigate} from "react-router-dom";
import Loader from "./Loader";

interface ProtectedProps {
	children: React.ReactNode;
	authentication?: boolean;
}

export default function Protected({ children, authentication = true }: ProtectedProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const isAuthenticated = useSelector((state: any) => state.auth.status);

    useEffect(() => {
        if (authentication && isAuthenticated != authentication) {   
            navigate("/login");
        }else if (!authentication && isAuthenticated != authentication) {
            navigate("/");
        }
        setLoading(false);
    }, [authentication, isAuthenticated, navigate]);
	return loading ? <Loader/> : <>{children}</>;
}