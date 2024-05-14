import { Link } from "react-router-dom"
export default function Home() {
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
        </>
    )
}