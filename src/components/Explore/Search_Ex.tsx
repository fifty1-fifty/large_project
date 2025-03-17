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


    async function doSearch(event:any) : Promise<void>
    {
        event.preventDefault();
        var obj = {searchQuery:search};
        var js = JSON.stringify(obj);
        try
        {
            
            const response = await fetch(buildPath('/api/login'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
           	var res = JSON.parse(await response.text());
            
           	console.log(res.id);
        }
        catch(error:any)
       	{
            alert(error.toString());
           	return;
        }
            
        

    functionn handleSetSearchQuery( e: any ) : void
    {
        setSearchQuery( e.target.value );
        console.log("killMe");
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
