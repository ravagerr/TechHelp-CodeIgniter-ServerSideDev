import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function SearchResults() {
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const location = useLocation()

    const query = new URLSearchParams(location.search).get('query')

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('http://localhost:6900/index.php/api/questions')
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText)
                }
                const data = await response.json()
                const filteredQuestions = data.filter(question =>
                    question.Title.toLowerCase().includes(query.toLowerCase())
                )
                setQuestions(filteredQuestions)
                setLoading(false)
            } catch (error) {
                setError(error.message)
                setLoading(false)
            }
        }

        fetchQuestions()
    }, [query])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div>
            <h1>Search Results for "{query}"</h1>
            {questions.length > 0 ? (
                <div>
                    {questions.map(question => (
                        <div key={question.QuestionSlug}>
                            <h2>
                                <Link className='browse-link' to={`/question/${question.QuestionSlug}`}>{question.Title}</Link>
                            </h2>
                            <p>{question.Body}</p>
                            <p>in {question.TagName} by <Link to={`/profile/${question.UserID}`}>{question.Username}</Link> ({question.ReputationPoints} points)</p>
                            <small>Posted: {new Date(question.PostDate).toLocaleDateString()}</small>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No questions found.</p>
            )}
        </div>
    )
}
