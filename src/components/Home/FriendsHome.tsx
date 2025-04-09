import SearchFriends from "./SearchFriends";
import FriendsCards from "./FriendsCards"

const FriendsHome = () => {
    return(
        <div className="FriendsHome">
            <SearchFriends />
            <FriendsCards />
        </div>
    )
}

export default FriendsHome;
