import React, { useState } from 'react';
//import isEmail from 'isemail';
import "./Search_Ex.css"

//const app_name = 'group22cop4331c.xyz';


/*function buildPath(route:string) : string
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


function Search()
{
    const [search, setSearchQuery] = React.useState('');




    functionn handleSetSearchQuery( e: any ) : void
    {
        setSearchQuery( e.target.value );
    }
            
    
    return (
        <div className="search-container">
            <label htmlFor="searchbar">Discover</label>
            <div className="form-group">
                <input type="text" id="searchbar" placeholder="Discover"/>
            </div>
            <button id="searchButton" onClick={handleSetSearchQuery}>Search</button>
        </div>

    );
}
export default Search;
