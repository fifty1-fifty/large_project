import React from 'react';
import Gallery_Ex from './Gallery_Ex';

import "./Search_Ex.css"


const app_name = 'group22cop4331c.xyz';


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
} 

/*function Search()
{

        
}*/

  async function doSearch(event:any) : Promise<void>
    {
        const [search, setSearchQuery] = React.useState('');
        event.preventDefault();
        var obj = {searchQuery:search};
        var js = JSON.stringify(obj);
        console.log(js);
        
        try
        {
            const response = await fetch(buildPath('/api/searchMovie'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
           	var res = JSON.parse(await response.text());
           	console.log(res);
        }
        catch(error:any)
       	{
            alert(error.toString());
           	return;
        }
    }

 function handleSetSearchQuery( e: any ) : void
    {
        setSearchQuery( e.target.value );
        console.log("killMe");
    }

const Parent = () => {
    const data = "testestest" 
    return (
        <div className="search-container">
            <label htmlFor="searchbar">Discover</label>
            <div className="form-group">
                <input type="text" id="searchbar" placeholder="Discover" onChange={handleSetSearchQuery}/>
            </div>
            <button id="searchButton" onClick={doSearch}>Search</button>
            <Gallery_Ex data = {data} />
        </div>
    );
};
export default Parent;
