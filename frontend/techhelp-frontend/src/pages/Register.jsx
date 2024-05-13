import { useState } from "react"

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })

    // Update state with form input
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        fetch('http://localhost:6900/index.php/usercontroller/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            alert(`Registration status: ${data.status}\nMessage: ${data.message}`)
        })
        .catch(error => {
            console.error('Error:', error)
            alert('An error occurred while trying to register the user.')
        })
    }

    return (
        <div className="form-center-container">
            <form onSubmit={handleSubmit} className="auth-form">
            <h1>Register</h1>
                    <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} /> <br />
                    <input type="email" name="email" value={formData.email} placeholder="Email" onChange={handleChange} /> <br />
                    <input type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange} /> <br />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}
