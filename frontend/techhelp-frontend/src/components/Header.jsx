// src/components/Header.jsx
import React from 'react'
import { useUser } from '../context/UserProvider'
import { Link } from 'react-router-dom'

export default function Header() {
    const { user } = useUser()

    return (
        <header>
            <p>Header</p>
            {user ? (
                <button>
                    <Link to={`/profile/${user.id}`}>Profile</Link>
                </button>
            ) : (
                <p>Not logged in</p>
            )}
        </header>
    )
}