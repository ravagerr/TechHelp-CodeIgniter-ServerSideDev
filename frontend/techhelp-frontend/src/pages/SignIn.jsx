import React, { useState } from "react"
import { useUser } from "../context/UserProvider"

export default function SignIn() {
    // State to hold the form data
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { setUser } = useUser() 
    
    const handleChange = (event) => {
        const { name, value } = event.target
        if (name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        }
    }

    const handleLogin = (event) => {
        event.preventDefault()

        fetch('http://localhost:6900/index.php/usercontroller/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                setUser({ id: data.userID })
                alert('Login successful! User ID: ' + data.userID)
            } else {
                alert('Login failed: ' + data.message)
            }
        })
        .catch(error => {
            console.error('Error:', error)
            alert('An error occurred. Please try again later.')
        })
    }

    function checkSession() {
        fetch('http://localhost:6900/index.php/usercontroller/checkSession', {
            credentials: 'include',
        }).then(res => {
            if (res.ok) {
                res.json().then(data => {
                    console.log('Response data:', data);
                });
            } else {
                console.log('Failed to fetch session data. Status:', res.status);
            }
        }).catch(error => {
            console.log('Error fetching data:', error);
        });
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label>
                    Email:
                    <input type="email" name="email" value={email} onChange={handleChange} required />
                </label><br />
                <label>
                    Password:
                    <input type="password" name="password" value={password} onChange={handleChange} required />
                </label><br />
                <button type="submit">Log In</button>
            </form>
            <button onClick={checkSession}>Check Session</button>
        </div>
    )
}
