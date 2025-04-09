import React, { useState } from "react";

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
        <div className="carousel-container relative flex items-center justify-center mt-10">
            <button onClick={goLeft} className="absolute left-0 text-3xl px-4 py-2">&#8592;</button>

            <div className="post-card w-80 p-4 bg-white rounded-2xl shadow-md text-center">
                <img src={posterUrl} alt={movieTitle} className="w-full h-96 object-cover rounded-xl mb-4" />
                <h3 className="text-xl font-semibold">{movieTitle}</h3>
                <p className="text-gray-500 text-sm mb-1">Posted by <span className="font-medium">{username}</span></p>
                {renderStars(rating)}
                <p className="text-sm mb-4">{comment}</p>
                <button
                    onClick={() => window.location.href = `/movie/${movieId}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition"
                >
                    View Movie Page
                </button>
            </div>

            <button onClick={goRight} className="absolute right-0 text-3xl px-4 py-2">&#8594;</button>
        </div>
    );
};

export default FriendsPosts;