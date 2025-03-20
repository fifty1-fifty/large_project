//import React from "react";
//<h5>{JSON.stringify(props.data)}</h5>
const Gallery_Ex = ( {posters} : {posters : string[]}) => {
    console.log(posters.length);
    return (
        <div className="container">
            <div className="row">
                {posters.map((poster : string, index : number) => (
                    <div key={index} className="col-sm-2 mb-4">
                        <div className="photo-card">
                            <img src={`https://image.tmdb.org/t/p/original${poster}`} className="card-img-top img-fluid" alt={`Movie Poster ${index}`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery_Ex;

