import Gallery_Ex from "./Gallery_Ex"
import React, { useState, useEffect } from "react";
import "./Search_Ex.css";
import { buildPath } from '../../utils'; 

let pageNumber = 1;
const Search_Ex = () => 
{
    const storedUser = localStorage.getItem("user_data");
    const user = storedUser ? JSON.parse(storedUser) : {};
    const token = user?.token;


    const [message, setMessage] = useState([JSON]);
    const [search, setSearchQuery] = React.useState('');
    let posterPath: JSON[] = [];

    const [loading, setLoading] = useState(false);
    //const [LOADmessage, setLOADMessage] = useState([]);
    

    useEffect(() => {
        popularPull();
        },
        []); 

        async function popularPull()
        {
            var obj = {page:pageNumber};
            var js = JSON.stringify(obj);
            //console.log("page has loaded");
            try{
                const response = await fetch(buildPath('/api/trendingMovie'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json', 'authorization' : token}})
                    var res = JSON.parse(await response.text());
                    for (let i = 0; i < res["movieData"].results.length; i++) 
                        {
                            if (res["movieData"].results[i].poster_path !== null) 
                            {
                                //console.log(res["movieData"].results[i].poster_path);
                                posterPath.push(res["movieData"].results[i]); // Push into array
                            }
                        }
                        setMessage(posterPath);
                        
            }
            catch(error:any)
            {
                if(res.message === "Invalid Token" || res.message === "Access Denied: No Token Provided")
                {
                    localStorage.clear();
                    window.location.href = '/login';
                }
                alert(error.toString());
                return;
            }
        }




    async function doSearch() : Promise<void>
    {
        //console.log(search);
        //event.preventDefault();
        var obj = {searchQuery:search, page:pageNumber};
        //console.log(obj);
        console.log(pageNumber);
        if(obj.searchQuery === "")
        {
            popularPull();
            return;
        }

        var js = JSON.stringify(obj);
        //console.log(js);
        
        try
        {
            const response = await fetch(buildPath('/api/searchMovie'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json', 'authorization' : token}})
                var res = JSON.parse(await response.text());


            for (let i = 0; i < res["movieData"].results.length; i++) 
            {
                if (res["movieData"].results[i].poster_path !== null) 
                {
                    //console.log(res["movieData"].results[i].poster_path);
                    posterPath.push(res["movieData"].results[i]); // Push into array
                }
            }
           
           setMessage(posterPath);
           //setMessage(res["movieData"].results.poster_path);
        }
        catch(error:any)
        {
            if(res.message === "Invalid Token" || res.message === "Access Denied: No Token Provided")
                {
                    localStorage.clear();
                    window.location.href = '/login';
                }
            alert(error.toString());
            return;
    }
}

function handleSetSearchQuery( e: any ) : void
{
    setSearchQuery( e.target.value );
    pageNumber = 1;
    doSearch();
}

async function nextPage(e: any): Promise<void>
{
    setLoading(true);

    e.preventDefault();
    pageNumber = pageNumber + 1;

    await doSearch();
    setLoading(false);
}

async function prevPage(e: any): Promise<void>
{
    if(pageNumber <= 1)
    {
        e.preventDefault();
        console.log("Already on the first page");
        return;
    }
    setLoading(true);
    pageNumber = pageNumber - 1;
    await doSearch();
    setLoading(false);
}


   return (
    <div className="move-down">
    <div className="form-group">
      <input
        type="text"
        id="searchbar"
        placeholder="Discover your favorites"
        onChange={handleSetSearchQuery}
      />
    </div>
  
    {loading ? (
      <div className="loading-message">Loading...</div>
    ) : (
      <Gallery_Ex movies={message} />
    )}
  
    <div className="page-navigation-button">
      <button id="theButton" onClick={prevPage}>
        <i className="material-icons" id="iconnon">arrow_back</i>
      </button>
      <button id="theButton" onClick={nextPage}>
        <i className="material-icons" id="iconnon">arrow_forward</i>
      </button>
    </div>
  </div>
  
    );
};

export default Search_Ex;
