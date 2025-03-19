import Gallery_Ex from "./Gallery_Ex"
import React, { useState, useEffect } from "react";

//import ajfa from "../Explore/photo/ajfa.jpg"
//import ajfa1 from "../Explore/photo/ajfa.png"

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

const Search_Ex = () => 
{
    const [message, setMessage] = useState([""]);
    const [search, setSearchQuery] = React.useState('');
    let posterPath: string[] = [];



    useEffect(() => {
        async function popularPull()
        {
            //console.log("page has loaded");
            try{
                const response = await fetch(buildPath('/api/trendingMovie'),
                {method:'POST',headers:{'Content-Type': 'application/json'}})
                    var res = JSON.parse(await response.text());
    
                    for (let i = 0; i < res["movieData"].results.length; i++) 
                        {
                            if (res["movieData"].results[i].poster_path !== null) 
                            {
                                //console.log(res["movieData"].results[i].poster_path);
                                posterPath.push(res["movieData"].results[i].poster_path); // Push into array
                            }
                        }
                        setMessage(posterPath);
            }
            catch(error:any)
            {
                alert(error.toString());
                return;
            }
        }
        popularPull();
        },
        []); 



        async function popularPull()
        {
            //console.log("page has loaded");
            try{
                const response = await fetch(buildPath('/api/trendingMovie'),
                {method:'POST',headers:{'Content-Type': 'application/json'}})
                    var res = JSON.parse(await response.text());
    
                    for (let i = 0; i < res["movieData"].results.length; i++) 
                        {
                            if (res["movieData"].results[i].poster_path !== null) 
                            {
                                //console.log(res["movieData"].results[i].poster_path);
                                posterPath.push(res["movieData"].results[i].poster_path); // Push into array
                            }
                        }
                        setMessage(posterPath);
            }
            catch(error:any)
            {
                alert(error.toString());
                return;
            }
        }




    async function doSearch(event:any) : Promise<void>
    {
        //console.log(search);
        event.preventDefault();
        var obj = {searchQuery:search};
        //console.log(obj);
        if(obj.searchQuery === "")
        {
            popularPull()
        }

        var js = JSON.stringify(obj);
        //console.log(js);
        
        try
        {
            const response = await fetch(buildPath('/api/searchMovie'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
                var res = JSON.parse(await response.text());


            for (let i = 0; i < res["movieData"].results.length; i++) 
            {
                if (res["movieData"].results[i].poster_path !== null) 
                {
                    //console.log(res["movieData"].results[i].poster_path);
                    posterPath.push(res["movieData"].results[i].poster_path); // Push into array
                }
            }
           
           setMessage(posterPath);
           //setMessage(res["movieData"].results.poster_path);
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
}


    return (
        <div>
            <label htmlFor="searchbar">Discover</label>
            <div className="form-group">
                <input type="text" id="searchbar" placeholder="Discover" onChange={handleSetSearchQuery}/>
            </div>
            <button id="searchButton" onClick={doSearch}>Search</button>
            <Gallery_Ex posters = {message}/>

      
        
        </div>
    );
};

export default Search_Ex;
