import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserProvider'

export default function Question() {
    const { slug } = useParams()
    const [question, setQuestion] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { user } = useUser()
    const [step, setStep] = useState(0)
    const [reply, setReply] = useState('')
    const navigate = useNavigate()

    const fetchQuestion = async () => {
        try {
            const response = await fetch(`http://localhost:6900/index.php/api/questions/${slug}`)
            if (!response.ok) {
                throw new Error('Question not found')
            }
            const data = await response.json()
            setQuestion(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQuestion()
    }, [slug])

    const handleVote = async (contentType, contentId, voteType) => {
        if (!user) {
            console.error('User not logged in')
            return
        }

        try {
            const response = await fetch(`http://localhost:6900/index.php/api/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user.id,
                    content_type: contentType,
                    content_id: contentId,
                    vote_type: voteType
                })
            })

            if (response.ok) {
                fetchQuestion()  // refetch question data after voting
            } else {
                console.error('Failed to vote', await response.json())
            }
        } catch (error) {
            console.error('Failed to vote', error)
        }
    }

    const handleReplySubmit = async () => {
        if (!user) {
            console.error('User not logged in')
            return
        }

        try {
            const response = await fetch(`http://localhost:6900/index.php/api/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user.id,
                    question_id: question.QuestionSlug,
                    body: reply
                })
            })

            if (response.ok) {
                setReply('')
                setStep(0)
                fetchQuestion()  // refetch question data after replying
            } else {
                console.log("Error occurred")
            } 
        } catch (error) {
            console.error('Failed to submit reply', error)
        }
    }

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error: {error}</p>
    }

    return (
        <>
        <div className='question-answer-container'>
            <div className="question-user-section-container">
                <img src="../src/assets/user_avatar.png" alt="Avatar" />
                <p><b>{question.Username}</b> | 123 points</p>
            </div>
            <h1>{question.Title}</h1>
            <p>{question.Body}</p>
            <small>Posted: {new Date(question.PostDate).toLocaleDateString()}</small>
            <div className="question-vote-container">
                <button className='upvote-btn vote-btn' onClick={() => handleVote('question', question.QuestionSlug, 'upvote')}>
                    <img src="../src/assets/arrow-top-circle.svg" alt="Upvote" />
                </button>
                <p>{question.Upvotes}</p>
                <button className='downvote-btn vote-btn' onClick={() => handleVote('question', question.QuestionSlug, 'downvote')}>
                    <img src="../src/assets/arrow-bottom-circle.svg" alt="Downvote" />
                </button>
                <p>{question.Downvotes}</p>
                {user ? (
                step === 0 ? (
                    <button className='question-reply-btn' onClick={() => setStep(1)}>Reply</button>
                ) : (
                    <div className='question-reply-container'>
                        <textarea className='question-reply-textarea' rows="10" cols="50"
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Write your reply..."
                        />
                        <button className="question-reply-btn" onClick={handleReplySubmit}>Submit</button>
                    </div>
                )
            ) : (
                <button className='question-reply-btn' onClick={() => navigate('/sign-in')}>Sign In</button>
            )}
            </div>
        </div>

        {question.answers && question.answers.length > 0 ? (
            <div>
                {question.answers.map(answer => (
                    <div key={answer.AnswerID} className='question-answer-container'>
                        <div className="question-user-section-container">
                            <img src="../src/assets/user_avatar.png" alt="Avatar" />
                            <p><b>{answer.Username}</b></p>
                        </div>
                        <p>{answer.Body}</p>
                        <small>Posted: {new Date(answer.PostDate).toLocaleDateString()}</small>
                        <div className="question-vote-container">
                            <button className='upvote-btn vote-btn' onClick={() => handleVote('answer', answer.AnswerID, 'upvote')}>
                                <img src="../src/assets/arrow-top-circle.svg" alt="Upvote" />
                            </button>
                            <p>{answer.Upvotes}</p>
                            <button className='downvote-btn vote-btn' onClick={() => handleVote('answer', answer.AnswerID, 'downvote')}>
                                <img src="../src/assets/arrow-bottom-circle.svg" alt="Downvote" />
                            </button>
                            <p>{answer.Downvotes}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p>No answers yet.</p>
        )}
        </>
    )
}
