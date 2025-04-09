import { useState } from "react";
import "./FriendsCards.css";

interface FriendPostCardProps {
    movieTitle: string;
    posterUrl: string;
    comment: string;
    username: string;
    rating: number;
    movieId: string;
}

const dummyPosts: FriendPostCardProps[] = [
    {
        movieTitle: "Inception",
        posterUrl: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
        comment: "Mind-bending masterpiece!",
        username: "movieFan101",
        rating: 5,
        movieId: "inception123"
    },
    {
        movieTitle: "La La Land",
        posterUrl: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
        comment: "Loved the music and visuals.",
        username: "jazzLover",
        rating: 4,
        movieId: "lalaland456"
    },
    {
        movieTitle: "Interstellar",
        posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        comment: "Beautiful and emotional ride.",
        username: "spaceDreamer",
        rating: 5,
        movieId: "interstellar789"
    }
];

const renderStars = (rating: number) => {
    return (
        <div className="flex justify-center mb-2">
            {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                </span>
            ))}
        </div>
    );
};

const FriendsPosts = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goLeft = () => {
        setCurrentIndex((prev) => (prev === 0 ? dummyPosts.length - 1 : prev - 1));
    };

    const goRight = () => {
        setCurrentIndex((prev) => (prev === dummyPosts.length - 1 ? 0 : prev + 1 ));
    };

    const { movieTitle, posterUrl, comment, username, rating, movieId } = dummyPosts[currentIndex];

    return (
        <div className="carousel-wrapper">
            <div className="post-card">
                <img src={posterUrl} alt={movieTitle} className="poster-image" />

                <div className="post-content">
                <h3 className="movie-title">{movieTitle}</h3>
                <p className="poster-user">
                    Posted by <span className="username">{username}</span>
                </p>
                {renderStars(rating)}
                <p className="movie-comment">{comment}</p>
                <button
                    onClick={() => (window.location.href = `/movie/${movieId}`)}
                    className="movie-button"
                >
                    View Movie Page
                </button>
                </div>
            </div>

            <div className="arrow-buttons">
                <button onClick={goLeft} className="arrow-button">
                &#8592;
                </button>
                <button onClick={goRight} className="arrow-button">
                &#8594;
                </button>
            </div>
        </div>
    );
};

export default FriendsPosts;