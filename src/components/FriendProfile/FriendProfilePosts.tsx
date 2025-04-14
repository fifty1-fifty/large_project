import React, { useEffect, useState } from 'react';
import './FriendProfilePosts.css';

interface FriendPostCardProps {
    movieTitle: string;
    posterUrl: string;
    comment: string;
    username: string;
    rating: number;
    movieId: string;
    userId: number;
}

interface FriendProfilePostsProps {
    friendId: number;
}

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

const FriendProfilePosts: React.FC<FriendProfilePostsProps> = ({ friendId }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [posts, setPosts] = useState<FriendPostCardProps[]>([]);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/posts/user/${friendId}`);
                const data = await res.json();

                const enrichedPosts: FriendPostCardProps[] = await Promise.all(
                    data.map(async (post: any) => {
                        try {
                            const infoRes = await fetch("/api/fullMovieInfo", {
                                method:"POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                                body: JSON.stringify({ id: post.movieId }),
                            });

                            const infoData = await infoRes.json();

                            return {
                                ...post,
                                movieTitle: infoData.movieData.title,
                                posterUrl: `https://image.tmdb.org/t/p/w500${infoData.movieData.poster_path}`,
                            };
                        } catch(err) {
                            console.error("Error fetching movie info:", err);
                            return {
                                ...post,
                                movieTitle: "Unknown Title",
                                posterUrl: null,
                            };
                        }
                    })
                );

                setPosts(enrichedPosts);
            } catch(err) {
                console.error("Error fetching friend's posts:", err);
            } finally {
                setLoading(false);
            }
        };
        if(friendId)    fetchPosts();
    }, [friendId]);

    const goLeft = () => {
        setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
    };

    const goRight = () => {
        setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
    };

    if(loading) return <div className="carousel-wrapper">Loading posts...</div>;
    if(posts.length === 0) return <div className="carousel-wrapper">This user has no posts yet.</div>;

    const { movieTitle, posterUrl, comment, username, rating, movieId } = posts[currentIndex];

    function gotoInfoPage(movieId: string)
    {
        window.location.href = `/movie?movieId=${movieId}`;
    }

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
                        onClick={() => (gotoInfoPage(movieId))}
                        className="movie-button"
                    >
                        View Movie Page
                    </button>
                </div>
            </div>

            <div className="arrow-buttons">
                <button onClick={goLeft} className="arrow-button">&#8592;</button>
                <button onClick={goRight} className="arrow-button">&#8594;</button>
            </div>
        </div>
    );
};

export default FriendProfilePosts;