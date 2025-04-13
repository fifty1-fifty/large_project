import React, { useState } from "react";

const SearchFriends = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<{ Login: string }[]>([]); // Update to match Login field

    // Fetch results as the user types
    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === "") {
            setResults([]); // Clear results if input is empty
            return;
        }

        try {
            const response = await fetch(`/api/search-users?Login=${query}`); // Change query param to login
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    return (
        <div className="move-down">
            <div className="form-group">
                <input 
                    type="text" 
                    id="searchbar" 
                    placeholder="Find Friends" 
                    value={searchQuery} 
                    onChange={handleSearch} 
                />
                {/* Dropdown menu for search results */}
                {results.length > 0 && (
                    <ul className="dropdown">
                        {results.map((user, index) => (
                            <li key={index} onClick={() => window.location.href = `/userProfile/${user.Login}`}>
                                {user.Login} {/* Update to use Login instead of username */}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SearchFriends;