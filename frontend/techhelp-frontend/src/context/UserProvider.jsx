// src/contexts/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react'

const UserContext = createContext()

export function useUser() {
    return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
   // http://localhost:6900/index.php/usercontroller/checkSession
   // https://w1855005.users.ecs.westminster.ac.uk/advanced-server-side/index.php/usercontroller/checkSession
    useEffect(() => {
        // Fetch the session data when the component mounts
        fetch('http://localhost:6900/index.php/usercontroller/checkSession', {
            credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
            if (data.userID) {
                setUser({ id: data.userID })
            }
        })
        .catch(error => {
            console.log('Error fetching user:', error)
        })
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}
