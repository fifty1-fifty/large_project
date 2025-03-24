import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./MovieInfo.css";



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




const Info = () => {

    
    const query = new URLSearchParams(useLocation().search);
    let movieId = query.get("movieId");


    // Initialize constants for full info movie pull
    let genres: string[] = [];
    const [genre, setGenre] = useState('');
    const [title, setTitle] = useState('');
    const [tagline, setTagline] = useState('');
    const [summary, setSummary] = useState('');
    const [runtime, setRuntime] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [budget, setBudget] = useState('');
    const [revenue, setRevenue] = useState('');
    const [rating, setRating] = useState('');
    const [ratingCount, setRatingCount] = useState('');
    const [poster, setPoster] = useState('');


    interface CastMember 
    {
        name: string;
        character: string;
        profile_path: string;
    }

    const [castList, setCastList] = useState<CastMember[]>([]);
    const [importantPersonOne, setImportantPersonOne] = useState([""]);
    //const [importantPersonTwo, setImportantPersonTwo] = useState([""]);
    



    useEffect(() => {
        fullMovieInfoPull();
        movieCreditsPull();
        },
        []); 

        function convertReleaseDate(originalDate : string)
        {
            const tempArr = originalDate.split("-");
            let newDateFormat = tempArr[1] + '/' + tempArr[2] + '/' + tempArr[0];
            return newDateFormat;
        }

        function convertRuntime(originalRuntime : number)
        {
            const hours = ~~((originalRuntime) / 60);
            const minutes = ((originalRuntime) % 60);
            return (hours + "h " + minutes + "m");
        }


        function findDirectorAndProfessions(crewArray: any[]) 
        {
            const director = crewArray.find((person: any) => person.job === "Director");
        
            const directorName: string = director.name;
            const professions: Set<string> = new Set(); // Use Set to avoid duplicate jobs
        
            professions.add(directorName);
            crewArray.forEach((person: any) => {
                if (person.name === directorName) {
                    professions.add(person.job);
                }
            });
        
            //console.log(Array.from(professions)[0]);

            //console.log(Array.from(professions).join(", "));
            return Array.from(professions); // Convert Set to a comma-separated string
        }

        // COME BACK AND FINISH WRITING THIS FUNCTION
       /* function findAnotherPerson(crewArray: JSON[]) 
        {
            const director = crewArray.find((person: JSON) => person.job === "Director");
        
            const directorName: string = director.name;
            const professions: Set<string> = new Set(); // Use Set to avoid duplicate jobs
        
            professions.add(directorName);
            crewArray.forEach((person: JSON) => {
                if (person.name === directorName) {
                    professions.add(person.job);
                }
            });
        
            //console.log(Array.from(professions)[0]);

            //console.log(Array.from(professions).join(", "));
            return Array.from(professions); // Convert Set to a comma-separated string
        } */

        
        

    async function fullMovieInfoPull()
    {
        var obj = {id:movieId};
        var js = JSON.stringify(obj);
        
        try{
            const response = await fetch(buildPath('/api/fullMovieInfo'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
                var res = JSON.parse(await response.text());

                let temp = "";
                //console.log(res);
                //final = res["movieData"].budget;
                //console.log(final);
                setTitle(res["movieData"].original_title);
                setTagline(res["movieData"].tagline);
                setSummary(res["movieData"].overview);

                for(let i = 0 ; i < res["movieData"].genres.length ; i++)
                {
                    genres.push(res["movieData"].genres[i].name);
                    temp = genres[0] + ", " + genres[1];
                }

                setGenre(temp);
                setRuntime(convertRuntime(res["movieData"].runtime));
                setReleaseDate(convertReleaseDate(res["movieData"].release_date));
                setBudget(res["movieData"].budget);
                setRevenue(res["movieData"].revenue);
                setRating(res["movieData"].vote_average);
                setRatingCount(res["movieData"].vote_count);
                setPoster (res["movieData"].poster_path);
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }
    }






    async function movieCreditsPull()
    {
        var obj = {id:movieId};
        var js = JSON.stringify(obj);
        
        try{
            const response = await fetch(buildPath('/api/movieCredit'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
                var res = JSON.parse(await response.text());
                //console.log(res);


                //console.log(castList);
                setCastList(res["movieData"].cast.sort((a: any, b: any) => a.order - b.order));

                
                
                setImportantPersonOne(findDirectorAndProfessions(res["movieData"].crew));
                //setImportantPersonTwo(findAnotherPerson(res["movieData"].crew));
                //console.log(importantPersonOne);                
                

                
                 
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }
    }

    
//https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg
//style={{ maxWidth: "150px", maxHeight: "200px", objectFit: "cover", borderRadius: "10px" }}

    //console.log(importantPersonOne[0]);
    return ( 
        <div className="container" id="padding">

            <div className="row">

                <div className="col-4">
                    <div className="photo-card">
                         <img src={`https://image.tmdb.org/t/p/original${poster}`} id="poster" className="card-img-top img-fluid" alt={"No Movies"} style={{ maxWidth: "350px", maxHeight: "1000px", objectFit: "cover", borderRadius: "5px"}} />
                    </div>
                </div>

                <div className="col-8">
                    <div className="row">
                        <div className="col">
                            <div className="card" id="title">
                                <h1 className="card-title" id="title-body">{title}</h1>
                                 <h1 className="card-text" id="tag">{tagline}</h1>
                                <h1 className="card-text" id="genre-date-runtime"> {releaseDate} | {genre} | {runtime} </h1>
                            </div>
                        </div>

                        <div className="col-5">
                            <div className="card" id="rating">
                                <h1 className="card-title" id="rating-body">What do you think?</h1>

                                <div id="vertical">
                                    <button id="rating-button">ah</button>
                                    <button id="rating-button">ah</button>
                                    <button id="rating-button">ah</button>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="row">
                         <div className="card" id="description">
                            <h1 className="card-title" id="summ-title">Description</h1>
                            <h1 className="card-text" id="summary">{summary}</h1>
                         </div>
                    </div>


                    <div className="row" id="important-crew">

                        <div className="col">
                             <div className="card" id="important-person-div" >
                                 <h1 className="card-title" id="important-person">{importantPersonOne[0]}</h1>
                                 <h1 className="card-text" id="important-person-jobs">{importantPersonOne[1]}, {importantPersonOne[2]}</h1>
                             </div>

                        
                             <div className="card" id="important-person-two-div" >
                                <h1 className="card-title" id="important-person">{importantPersonOne[0]}</h1>
                                <h1 className="card-text" id="important-person-jobs">{importantPersonOne[1]}, {importantPersonOne[2]}</h1>
                             </div>
                        </div>



                        <div className="col">
                             <div className="card" id="budget-revenue-div" >
                                 <h1 className="card-title" id="budget">Budget</h1>
                                 <h1 className="card-text" id="budget-value">${budget}</h1>
                            </div>

                            <div className="card" id="budget-revenue-div" >
                                 <h1 className="card-title" id="revenue">Revenue</h1>
                                 <h1 className="card-text" id="revenue-value">${revenue}</h1>
                            </div>

                        
                        </div>

                    </div>


                </div>
            </div>




        <div className="row" id="row-color" >

            <div className="row">
                <h1 id="cast-header">Cast</h1>
            </div>

            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">

                     {/* Slide 1 */}
                    <div className="carousel-item active">
                            <div className="container">
                                <div className="row" id="carousel-width">
                                    {castList.slice(0, 7).map((cast, index) => (
                                        <div key={index} className="col-sm" id="photo-slide">
                                            <div className="photo-card">
                                                <img src={!cast.profile_path || cast.profile_path === "null" ? "https://upload.wikimedia.org/wikipedia/commons/8/83/Default-Icon.jpg" : `https://image.tmdb.org/t/p/original${cast.profile_path}`} className="card-img-top img-fluid" alt={cast.name || "No Name"} style={{ maxWidth: "150px", maxHeight: "200px", objectFit: "cover", borderRadius: "5px" }}/>
                                            <div className="card-body">
                                                         <h5 className="card-title">{cast.name}</h5>
                                                            <p className="card-text">{cast.character}</p>
                                                    </div>
                                            </div>
                                        </div>
                                     ))}
                                </div>
                             </div>
                         </div>

                        {/* Slide 2 */}
                        <div className="carousel-item ">
                            <div className="container">
                                <div className="row" id="carousel-width">
                                    {castList.slice(7, 14).map((cast, index) => (
                                        <div key={index} className="col-sm" id="photo-slide">
                                            <div className="photo-card">
                                                <img src={!cast.profile_path || cast.profile_path === "null" ? "https://upload.wikimedia.org/wikipedia/commons/8/83/Default-Icon.jpg" : `https://image.tmdb.org/t/p/original${cast.profile_path}`} className="card-img-top img-fluid" alt={cast.name || "No Name"} style={{ maxWidth: "150px", maxHeight: "200px", objectFit: "cover", borderRadius: "5px" }} />
                                                     <div className="card-body">
                                                         <h5 className="card-title">{cast.name}</h5>
                                                            <p className="card-text">{cast.character}</p>
                                                    </div>
                                            </div>
                                        </div>
                                     ))}
                                </div>
                             </div>
                         </div>

                        {/* Slide 3 */}
                        <div className="carousel-item ">
                            <div className="container">
                                <div className="row" id="carousel-width">
                                    {castList.slice(14, 21).map((cast, index) => (
                                        <div key={index} className="col-sm" id="photo-slide">
                                            <div className="photo-card">
                                                <img src={!cast.profile_path || cast.profile_path === "null" ? "https://upload.wikimedia.org/wikipedia/commons/8/83/Default-Icon.jpg" : `https://image.tmdb.org/t/p/original${cast.profile_path}`} className="card-img-top img-fluid" alt={cast.name || "No Name" } style={{ maxWidth: "150px", maxHeight: "200px", objectFit: "cover", borderRadius: "5px" }}  />
                                            <div className="card-body">
                                                         <h5 className="card-title">{cast.name}</h5>
                                                            <p className="card-text">{cast.character}</p>
                                                    </div>
                                            </div>
                                        </div>
                                     ))}
                                </div>
                             </div>
                         </div>
                    </div>

      {/* Carousel Controls */}
      <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" id="prev"></span>
        <span className="visually-hidden" >Previous</span>
      </a>
      <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" id="next"></span>
        <span className="visually-hidden" >Next</span>
      </a>
    </div>
  
    </div>



             
                <h1>{rating} + {ratingCount}"</h1>
            

            </div>

  




    );
};
export default Info;
