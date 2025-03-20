import { useLocation } from "react-router-dom";
import { useEffect } from "react";


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
    var final;

    useEffect(() => {
        fullMovieInfoPull();
        },
        []); 



    async function fullMovieInfoPull()
    {
        var obj = {id:movieId};
        var js = JSON.stringify(obj);
        

        try{
            const response = await fetch(buildPath('api/fullMovieInfo'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})
                var res = JSON.parse(await response.text());
                console.log(res);
                final = res["movieData"].budget;
                console.log(final);

        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }




    }
    return <div>Movie ID: {final}</div>;
};

export default Info;
