// src/components/Header.jsx
import React from 'react'
import { useUser } from '../context/UserProvider'
import { Link } from 'react-router-dom'

export default function Header() {
    const { user } = useUser()

    return (
        <header>
            <nav>
                <Link to={'/'} className='nav-link nav-index'>TechHelp</Link>
                <div className="nav-right">
                    <Link to={'/browse'} className='nav-link'>Browse</Link>
                    <Link to={'/'} className='nav-link'>Search</Link>
                    {user ? (
                        <button>
                            <Link to={`/profile/${user.id}`}>Profile</Link>
                        </button>
                    ) : (
                        <p>Not logged in</p>
                    )}
                </div>
            </nav>
        </header>
    )
}