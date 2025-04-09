import SearchFriends from "./SearchFriends";
import FriendsCards from "./FriendsCards"
import "./FriendsHome.css";

const FriendsHome = () => {
    return(
        <div className="FriendsHome">
            <SearchFriends />
            <FriendsCards />
        </div>
    )
}

export default FriendsHome;
