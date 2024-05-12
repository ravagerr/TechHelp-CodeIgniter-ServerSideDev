import { useState } from "react";

export default function SignIn() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    // Update state with form input
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        fetch('http://localhost:6900/index.php/usercontroller/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert(`Registration status: ${data.status}\nMessage: ${data.message}`);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while trying to register the user.');
        });
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />
                </label><br />
                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </label><br />
                <label>
                    Password:
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                </label><br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
