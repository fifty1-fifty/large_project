import { useEffect, useState } from "react";
import "./FriendsCards.css";
import { buildPath } from "../../utils";

interface FriendPostCardProps {
    movieId: string;
    userId: number;
    username: string;
    rating: number;
    comment: string;
    movieTitle: string;
    posterUrl: string;
}

const renderStars = (rating: number) => {
    return (
        <div className="star-rating">
            {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < rating ? "star-filled" : "star-empty"}>
                    ★
                </span>
            ))}
        </div>
    );
};

const movieTitleAndPosterPull = async (movieId: string, token: string | null) => {
    const body = JSON.stringify({ id: movieId });

    try {
        const response = await fetch(buildPath("/api/fullMovieInfo"), {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/json",
                authorization: token ?? "",
            },
        });

        const res = await response.json();

        // handle token error and redirect
        if(res.message === "Invalid Token" || res.message === "Access Denied: No Token Provided") {
            localStorage.clear();
            window.location.href = "/login";
            return { title: "Unknown Title", posterPath: null };
        }

        return {
            title: res.movieData?.original_title ?? "Unknown Title",
            posterPath: res.movieData?.poster_path ?? null,
        };
    } catch(err) {
        console.error("Failed: ", err);
        return { title: "Unknown Title", posterPath: null };
    }
}

const FriendsCards = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const [posts, setPosts] = useState<FriendPostCardProps[]>([]);
    const [loading, setLoading] = useState(true);

    const user = localStorage.getItem("user_data");
    let userId: number | null = null;
    let token: string | null = null;
    if(user) {
        try {
            const userData = JSON.parse(user);
            userId = userData.id;
            token = userData.token;
        } catch(err) {
            console.error("Failed to parse user_data from localStorage:", err);
        }
    }


    useEffect(() => {
        const fetchPosts = async () => {
            if(!userId) {
                console.error("No userId found in localStorage");
                setLoading(false);
                return;
            }
            var res;
            try {
                res = await fetch(buildPath(`/api/friends-posts/${userId}`));
                const data = await res.json();
                console.log(res);
                console.log(data);

                const enrichedPosts: FriendPostCardProps[] = await Promise.all(
                    data.map(async (post: any) => {
                        const movieInfo = await movieTitleAndPosterPull(post.movieId, token);
                        return {
                            ...post,
                            movieTitle: movieInfo.title,
                            posterUrl: movieInfo.posterPath
                                ? `https://image.tmdb.org/t/p/w500${movieInfo.posterPath}`
                                : null,
                        };
                    })
                );

                setPosts(enrichedPosts);
                setLoading(false);
            } catch(err) {
                console.log(res);
                console.log(err);
                console.error("Error fetching friend posts:", err);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [userId]);

    const goLeft = () => {
        setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
    };

    const goRight = () => {
        setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1 ));
    };

    if(loading) return <div className="carousel-wrapper">Loading posts...</div>;
    if(posts.length === 0) return <div className="carousel-wrapper">No posts from your friends yet.</div>;

    const { movieTitle, posterUrl, comment, username, rating, movieId } = posts[currentIndex];

    function gotoInfoPage(movieId: string)
    {
        window.location.href = `/movie?movieId=${movieId}`;
    }

    function gotoUserProfile(userId: number)
    {
        window.location.href = `/profile/${userId}`;
    }

    return (
        <div id="carousel-wrapper">
            <div className="post-card animate-slide-in" >
                <img src={posterUrl} alt={movieTitle} className="poster-image" />

                <div className="post-content">
                <h3 id="movie-title">{movieTitle}</h3>
                <p className="poster-user">
                    Posted by <span className="username clickable" onClick={() => gotoUserProfile(posts[currentIndex].userId)}>{username}</span>
                </p>
                {renderStars(rating)}
                <p className="movie-comment">{comment}</p>
                <button
                    onClick={() => (gotoInfoPage(movieId))}
                    className="movie-button"
                >
                    More Info
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

export default FriendsCards;
