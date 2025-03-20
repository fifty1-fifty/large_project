//import React from "react";
//<h5>{JSON.stringify(props.data)}</h5>
import './Gallery_Ex.css';

const Gallery_Ex = ( {movies} : {movies : any}) => {


    let posters: string[] = [];
    for(let i = 0 ; i < movies.length ; i++)
    {
       // posters[i] = ;
       posters.push(movies[i].poster_path)
    } 

    function gotoInfoPage(selectedMovie : number)
    {
        //window.location.href = '/explore';
        console.log(movies[selectedMovie].id);

        window.location.href = `/movie?movieId=${movies[selectedMovie].id}`;
    }



    
       return ( 
        <div className="container">
        <div className="row">
            {posters.map((poster : string, index : number) => (
                <div key={index} className="col-sm-2 mb-4">
                    <div className="photo-card">
                <img src={`https://image.tmdb.org/t/p/original${poster}`} id="poster" className="card-img-top img-fluid" alt={"No Movies"} onClick={() => gotoInfoPage(index)} style={{ cursor: "pointer"}}/>
            </div>
        </div>
    ))}
</div>
</div> 
    
    );
};

export default Gallery_Ex;

