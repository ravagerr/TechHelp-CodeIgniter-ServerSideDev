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
        <div className="form-center-container">
            <form onSubmit={handleLogin} className="auth-form">
            <h1>Sign in to TechHelp Community</h1>
                    <input type="email" name="email" value={email} placeholder="Email" onChange={handleChange} required /> <br />
                    <input type="password" name="password" value={password} placeholder="Password" onChange={handleChange} required /> <br />
                <button type="submit">Log In</button>
            </form>
            {/* <button onClick={checkSession}>Check Session</button> */}
        </div>
    )
}
