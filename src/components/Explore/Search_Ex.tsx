import Gallery_Ex from "./Gallery_Ex"
import React, { useState, useEffect } from "react";
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

let pageNumber = 1;
const Parent = () => 
{
    const [message, setMessage] = useState([""]);
    const [search, setSearchQuery] = React.useState('');
    let posterPath: string[] = [];
    



    useEffect(() => {
        /*async function firstPull()
        {
            //console.log("page has loaded");
            try{
                const response = await fetch(buildPath('api/trendingMovie'),
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
        firstPull();*/
        popularPull();
        },
        []); 



        async function popularPull()
        {
            var obj = {page:pageNumber};
            var js = JSON.stringify(obj);
            //console.log("page has loaded");
            try{
                const response = await fetch(buildPath('api/trendingMovie'),
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
            }
            catch(error:any)
            {
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
            const response = await fetch(buildPath('api/searchMovie'),
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
    pageNumber = 1;
}

function nextPage(e: any): void
{
    e.preventDefault();
    pageNumber = pageNumber + 1;
    doSearch();
}

function prevPage(e: any): void
{
    if(pageNumber <= 1)
    {
        e.preventDefault();
        console.log("Already on the first page");
        return;
    }
    pageNumber = pageNumber - 1;
    doSearch();
}


   return (
        <div>
            <label htmlFor="searchbar">Discover</label>
            <div className="form-group">
                <input type="text" id="searchbar" placeholder="Discover" onChange={handleSetSearchQuery}/>
                <button id="searchButton" onClick={doSearch}> <i className="material-icons">search</i></button>
            </div>
            <Gallery_Ex posters = {message}/>

           <div className="page-navigation-button">
            <button id="nextButton"onClick={prevPage} ><i className="material-icons">arrow_back_ios</i></button>
            <button id="prevButton"onClick={nextPage}><i className="material-icons">arrow_forward_ios</i></button>
            </div>

        </div>
    );
};

export default Search_Ex;
