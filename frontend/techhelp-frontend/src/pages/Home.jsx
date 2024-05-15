import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('http://localhost:6900/index.php/api/questions');
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                const data = await response.json();
                setQuestions(data.slice(0, 4)); // Limit results to a maximum of four
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="home-hero-container">
                <h1 className="home-hero-title">TechHelp Community</h1>
                <p className="home-hero-subtitle">Some default text to fill some space, and something more so there is more text</p>

                <input placeholder="Search" type="text" />

                <Link className='home-hero-link' to='/'>Learn more about the TechHelp Community</Link>

                <img src="./public/img/home-hero-img.jpeg" alt="" className="home-hero-img" />
            </div>

            <div className="home-category-container">
                <h2 className="home-category-title">Select your category to find related topics</h2>

                <div className="home-category-boxes">
                    <div className="home-category-box">
                        <img src="./public/img/laptops.png" alt="" />
                        <Link to='/questions/tag/Laptops'>Laptops</Link>
                    </div>

                    <div className="home-category-box">
                        <img src="./public/img/phones.jpeg" alt="" />
                        <Link to='/questions/tag/Phones'>Phones</Link>
                    </div>

                    <div className="home-category-box">
                        <img src="./public/img/tablets.jpeg" alt="" />
                        <Link to='/questions/tag/Tablets'>Tablets</Link>
                    </div>

                    <div className="home-category-box">
                        <img src="./public/img/vr.jpeg" alt="" />
                        <Link to='/questions/tag/VR'>VR</Link>
                    </div>
                </div>
            </div>

            <div className="home-latest-tips-container">
                <div className="latest-tips-body">
                    <h1 className="latest-tips-title">Latest Tips</h1>
                    <p className="latest-tips-subtitle">Get insights from experienced community members.</p>

                    <Link to='/browse'>See all tips</Link>

                    {/* Map over questions here */}
                    <div className='latest-tips-box-container'>
                        {questions.map(question => (
                            <>
                            <div className='latest-tips-boxes'>
                                <div className='latest-tips-left' key={question.QuestionSlug}>
                                <img src="./public/img/user_avatar.png" alt="" />
                                </div>
                                <div className="latest-tips-right">
                                    <h2>
                                        <Link className='home-browse-link' to={`/question/${question.QuestionSlug}`}>{question.Title}</Link>
                                    </h2>
                                    <p>{question.Body}</p>
                                    <p><Link className='profile-link' to={`/profile/${question.UserID}`}>{question.Username}</Link> | {question.ReputationPoints} points</p>
                                    <Link className='read-full-post-link' to={`/question/${question.QuestionSlug}`}>Read full post ></Link>
                                </div>
                            </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>

            <div className="home-new-container">
                <img src="./public/img/Message_light.svg" alt="" />
                <h1>New to the Community?</h1>
                <Link to='/register'>Join now</Link>
            </div>
        </>
    );
}
