import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserProvider';

export default function ProtectedRoute({ children, redirectTo }) {
    const { user } = useUser();

    return user ? <Navigate to={redirectTo} /> : children;
}
