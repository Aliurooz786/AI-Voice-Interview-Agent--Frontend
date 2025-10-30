import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

/**
 * Catches the redirect from the Spring Boot backend, grabs the JWT token
 * from the URL, saves it, and redirects to the dashboard.
 */
const OAuth2RedirectHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            console.error("OAuth2 Error during redirect:", error);
            alert(`OAuth Error: ${error}. Please try logging in with email/password.`);
            navigate('/login', { replace: true });
            return;
        }

        if (token) {
            console.log("OAuth2 token captured successfully.");
            localStorage.setItem('jwt_token', token);
            navigate('/dashboard', { replace: true });
        } else {
            console.error("OAuth2 redirect: No token or error found.");
            navigate('/login', { replace: true });
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <h1 className="text-white text-xl font-bold">Processing Google Login...</h1>
        </div>
    );
};

export default OAuth2RedirectHandler;