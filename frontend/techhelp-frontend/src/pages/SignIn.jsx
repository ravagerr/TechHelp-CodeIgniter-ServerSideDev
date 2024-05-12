import React, { useState } from "react"

export default function Register() {
    // State to hold the form data
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Handle form field changes
    const handleChange = (event) => {
        const { name, value } = event.target
        if (name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        }
    }

    // Handle form submission
    const handleLogin = (event) => {
        event.preventDefault() // Prevent the form from being submitted in the traditional way

        // Send the POST request with the email and password to the backend
        fetch('http://localhost:6900/index.php/usercontroller/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Login successful! User ID: ' + data.userID)
                // Handle additional tasks after successful login if needed
            } else {
                alert('Login failed: ' + data.message)
            }
        })
        .catch(error => {
            console.error('Error:', error)
            alert('An error occurred. Please try again later.')
        })
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
        </div>
    )
}
