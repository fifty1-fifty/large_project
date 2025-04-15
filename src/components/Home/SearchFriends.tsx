import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchFriends.css";

const SearchFriends = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<{ UserId: number, Login: string }[]>([]);
    const navigate = useNavigate();

    const storedUser = localStorage.getItem("user_data");
    const currentUser = storedUser ? JSON.parse(storedUser) : {};
    const currentUserId = currentUser?.id;

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === "") {
            setResults([]);
            return;
        }

        try {
            const response = await fetch(`/api/search-users?Login=${query}`);
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const handleUserClick = (userId: number) => {
        if (userId === currentUserId) {
            navigate("/profile");
        } else {
            navigate(`/profile/${userId}`);
        }
    };

    return (
        <div className="move-down">
            <div className="form-group search-container">
                <input
                    type="text"
                    id="searchbar"
                    placeholder="Find Friends"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                />
                {results.length > 0 && (
                    <ul className="dropdown">
                        {results.map((user, index) => (
                            <li key={index} onClick={() => handleUserClick(user.UserId)}>
                                {user.Login}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SearchFriends;
