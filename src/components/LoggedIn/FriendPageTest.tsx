import React, { useState } from 'react';

//, { useState } 

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




function FriendUI()
{
    let _ud : any = localStorage.getItem('user_data');
    let ud = JSON.parse( _ud );
    let userId : string = ud.id;

    const [searchFriend,setSearchValue] = React.useState('');
    const [searchFriendResults,setResults] = useState('');
     const [friendList,setFriendList] = useState('');
    
    //const [message,setMessage] = React.useState('');
    


    async function friendLookup(e:any) : Promise<void>
    {
    e.preventDefault();
    let obj = {search:searchFriend, userId:userId}; //second one is the local variable in the func
    let js = JSON.stringify(obj);
    

    console.log(obj)

    try
    {
        const response = await fetch(buildPath('/api/searchusers'),
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}})


        let txt = await response.text();
        let res = JSON.parse(txt);
        let _results = res.usersLookups; //jfuijoewhfujkedshjfuiojedshfuio
        let resultText = '';
        for( let i=0; i<_results.length; i++ )
        {
            resultText += _results[i];
            if( i < _results.length - 1 )
            {
                resultText += ', ';
            }
        }
        setResults('Your Friends');
        setFriendList(resultText);
        
        //console.log(resultText)
    }

    catch(error:any)
    {
        alert(error.toString());
    }

    };




    function handleSearchTextChange( e: any ) : void
    {
        setSearchValue( e.target.value );
    };

   

    return(
    <div id="FriendUIDiv">
    <br />

    Search Friend: <input type="text" id="searchFriend" placeholder="Search for Friends"
    onChange={handleSearchTextChange} />
    <button type="button" id="searchFriendButton" className="buttons"
    onClick={friendLookup}> Search Friends</button><br />

    <br /> <span id="friendResult">{searchFriendResults}</span>
    <p id="cardList">{friendList}</p><br /><br />

    </div>

    
);
}
export default FriendUI; 


/*   Add: <input type="text" id="cardText" placeholder="Card To Add"
    onChange={handleCardTextChange} />
    <button type="button" id="addCardButton" className="buttons"
    onClick={addCard}> Add Card </button><br />
    <span id="cardAddResult">{message}</span> */