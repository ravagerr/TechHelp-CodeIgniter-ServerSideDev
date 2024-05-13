import React, { useState, useEffect } from 'react'

export default function Browse() {
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('http://localhost:6900/index.php/api/questions')
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText)
                }
                const data = await response.json()
                setQuestions(data)
                setLoading(false)
            } catch (error) {
                setError(error.message)
                setLoading(false)
            }
        }

        fetchQuestions()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div>
            <h1>Browse Questions</h1>
            {questions.length > 0 ? (
                <ul>
                    {questions.map(question => (
                        <li key={question.QuestionSlug}>
                            <h2>{question.Title}</h2>
                            <p>{question.Body}</p>
                            <small>Posted: {new Date(question.PostDate).toLocaleDateString()}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No questions found.</p>
            )}
        </div>
    )
}
