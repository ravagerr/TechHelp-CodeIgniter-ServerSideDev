import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserProvider';

export default function CreateQuestion() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [tag, setTag] = useState('');

    const handleCreateQuestion = async (e) => {
        e.preventDefault();

        if (!user) {
            navigate('/sign-in');
            return;
        }

        try {
            const response = await fetch('http://localhost:6900/index.php/api/questions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    body,
                    tag_id: parseInt(tag)
                }),
                credentials: 'include'
            });

            if (response.ok) {
                navigate('/browse');
            } else {
                const errorData = await response.json();
                console.error('Failed to create question:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Create a Question</h1>
            {user ? (
                <form onSubmit={handleCreateQuestion} className='create-form'>
                    <div className='create-form-input-container'>
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className='create-form-input-container'>
                        <label>Body</label>
                        <textarea rows="10" cols="100"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            required
                        />
                    </div>
                    <div className='create-form-input-container'>
                        <label>Category</label>
                        <select value={tag} onChange={(e) => setTag(e.target.value)} required>
                            <option value="">Select a category </option>
                            <option value="2">Laptops</option>
                            <option value="3">Phones</option>
                            <option value="4">Tablets</option>
                            <option value="5">VR</option>
                        </select>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            ) : (
                <div>
                    <p>Please <button onClick={() => navigate('/sign-in')}>Sign In</button> or <button onClick={() => navigate('/register')}>Register</button> to create a question.</p>
                </div>
            )}
        </div>
    );
}
