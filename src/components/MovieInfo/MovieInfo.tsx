import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./MovieInfo.css";
import { buildPath } from '../../utils'; 
import StarRating from "./StarRating";


/*
this is a message from Carter, anything on this page and related to this page just dont fuck with
or I will find the thickest rope and hang myself in the classroom with only you to blame. DONT TOUCHY THIS PAGE 
*/

const Info = () => {

    // Initialize states for toggling the form view
    const [showForm, setShowForm] = useState(false);
    const toggleForm = () => setShowForm(!showForm);
    const handleSubmit = (e: React.FormEvent) =>
    {
        e.preventDefault();
        console.log("go fuyck yourself");
    }


    // Handling setting ratings and shit
    const [movieSpecificComment, setMovieSpecificComment] = useState('');
    const [movieSpecificRating, setMovieSpecificRating] = useState(Number);

    // Get current movieID from the url
    const query = new URLSearchParams(useLocation().search);
    let movieId = query.get("movieId");

    // Get userID from local storage
    const storedUser = localStorage.getItem("user_data");
    const use = storedUser ? JSON.parse(storedUser) : {};
    const user = use?.id;
    const token = use?.token;
    
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
    const [poster, setPoster] = useState('');

    
    interface CastMember 
    {
        name: string;
        character: string;
        profile_path: string;
    }

    // Initiliaze cast list, and two very important people
    const [castList, setCastList] = useState<CastMember[]>([]);
    const [importantPersonOne, setImportantPersonOne] = useState([""]);
    const [importantPersonTwo, setImportantPersonTwo] = useState([""]);

    
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


    function findDirectorAndProfessions(crewArray: any[]) {
        const director = crewArray.find((person: any) => person.job === "Director");
    
        if (!director) return []; // Handle case where no director is found
    
        const directorName: string = director.name;
        const professions: Set<string> = new Set();
    
        professions.add(directorName);
    
        crewArray.forEach((person: any) => {
            if (person.name === directorName) {
                professions.add(person.job);
            }
        });
    
        let professionArray = Array.from(professions);
    
        // If there are more than 2 elements, add a comma to the second element
        if (professionArray.length > 2) {
            professionArray[1] = professionArray[1] + ",";
        }
    
        return professionArray;
    }    
    
    function findAnotherPerson(crewArray: any[]) 
        {
            const director = crewArray.find((person: any) => person.job === "Director");
            const directorName: string = director.name;
            const newman: Set<string> = new Set();
            //console.log("hello there" + director.name);

            for(let i = 0 ; i < crewArray.length ; i++)
            {
                if(crewArray[i].name !== directorName)
                {
                    newman.add(crewArray[i].name);
                    newman.add(crewArray[i].job);
                    break;
                    //return Array.from(newman);
                }
            }

            //console.log(Array.from(newman));
            return Array.from(newman);
            
    } 

    function handleSetMovieSpecificComment( e: any ) : void
    {
        setMovieSpecificComment( e.target.value );
    }



    async function fullMovieInfoPull()
    {
        var obj = {id:movieId};
        var js = JSON.stringify(obj);
        
        try{
            const response = await fetch(buildPath('/api/fullMovieInfo'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json', 'authorization' : token}})
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
                //setRating(res["movieData"].vote_average);
                //setRatingCount(res["movieData"].vote_count);
                setPoster (res["movieData"].poster_path);
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


    async function movieCreditsPull()
    {
        var obj = {id:movieId};
        var js = JSON.stringify(obj);
        
        try{
            const response = await fetch(buildPath('/api/movieCredit'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json', 'authorization' : token}})
                var res = JSON.parse(await response.text());
                //console.log(res);

                setCastList(res["movieData"].cast.sort((a: any, b: any) => a.order - b.order));
                setImportantPersonOne(findDirectorAndProfessions(res["movieData"].crew));
                setImportantPersonTwo(findAnotherPerson(res["movieData"].crew.sort((a: any, b: any) => b.popularity - a.popularity)));
 
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

    async function addMovie( ratingValue : any )
    {
        var obj = {userid:user, movieid:movieId, rating:ratingValue, comment:movieSpecificComment};
        var js = JSON.stringify(obj);
        
        try{
            const response = await fetch(buildPath('/api/addmovietoprofile'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json', 'authorization' : token}})
                var res = JSON.parse(await response.text());
                console.log(res);
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

        try{
            const response = await fetch(buildPath('/api/createpost'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json', 'authorization' : token}})
                var res = JSON.parse(await response.text());
                console.log(res);
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

    
    return ( 
        <div className="container" id="padding">

            <div className="row">

                <div className="col-4">
                    <div className="photo-card" >
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
                                <h1 className="card-title" id="rating-body">What did you think?</h1>

                                <div id="vertical">
                                    <button id="rating-button" onClick={() => addMovie(null)}><i id="con" className="material-icons">library_add</i>Add to your Collection</button>
                                    <button id="rating-button" onClick={toggleForm}><i id="con" className="material-icons">edit_note</i>Give your Thoughts</button>
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
                                 <h1 className="card-text" id="important-person-jobs">{importantPersonOne[1]} {importantPersonOne[2]}</h1>
                             </div>

                        
                             <div className="card" id="important-person-two-div" >
                                <h1 className="card-title" id="important-person">{importantPersonTwo[0]}</h1>
                                <h1 className="card-text" id="important-person-jobs">{importantPersonTwo[1]}</h1>
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



            





    {showForm && (
        <div className="popup-background" onClick={toggleForm}>
          <div className="popup-formu" id="back" onClick={(e) => e.stopPropagation()}>
            <h3>Give your take</h3>
            <form onSubmit={handleSubmit}>
              <StarRating onRatingChange={function (value: number): void {
                                setMovieSpecificRating(value);
                            } } />
              <textarea id="comment-input" onChange={handleSetMovieSpecificComment} placeholder="What did you think...?" />
                <div className="form-buttons"> 
                    <button id="cancel-button" onClick={toggleForm}><i className="material-icons">close</i>Cancel</button>
                    <button id="super-button" onClick={() => {addMovie(movieSpecificRating), toggleForm()}}><i className="material-icons">add</i>Add</button>
                 </div>
            </form>
          </div>
        </div>
      )}


    </div>

  




    );
};
export default Info;
