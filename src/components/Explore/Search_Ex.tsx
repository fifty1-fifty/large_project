import React, { useState } from 'react';

import "./Search_Ex.css"


/*const app_name = 'group22cop4331c.xyz';
function buildPath(route:string) : string
{
    if (process.env.NODE_ENV != 'development')
    {
        return 'http://' + app_name + route;
    }
    else
    {
        return 'http://localhost:5000/' + route;
    }
} */


const Search_Ex = ({ fetchData }) =>
{
    const [search, setSearch] = useState('');
    
    const handleSearch = () =>
    {
        fetchData(search);
    };
            


    return (
        <div className="search-container">
            <label htmlFor="searchbar">Discover</label>
            <div className="form-group">
                <input type="text" id="searchbar" placeholder="Discover" value={input} onChange{(e) => setInput(e.target.value)}/>
            </div>
                <button onClick={handleSearch}>Search</button>
        </div>

    );
}
export default Search_Ex;
